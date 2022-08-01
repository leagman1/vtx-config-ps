module.exports = {
    parseConfigFile: parseConfigFile,
    parseConfigString: parseConfigString,

    serialiseToConfigString: serialiseToConfigString,
    writeConfigString: writeConfigString,
};

const path = require("path");

const {readFileSync, writeFileSync} = require("fs");

function parseConfigFile(filePath){
    var configString = readSettingsFile(filePath).match(/\[[a-zA-Z]*\]|.*=.*/g);

    return parseConfigString(configString);
}

function parseConfigString(configString){
    psLog("Parsing settings file to an object.");

    var regXCategory = /\[[a-zA-Z]*\]/;

    var settings = [];

    for(let i = 0; i< configString.length; i++){
        let currentLine = configString[i];

        if(regXCategory.test(currentLine)){
            currentLine = currentLine.replace("[", "").replace("]", "");

            var category = {displayName: getSettingDisplayName(currentLine), name: currentLine, settings: []};
        } else {
            let setting = {};

            if(currentLine.match(/=/g).length == 4 || currentLine.match(/=/g).length == 5){
                // it's RGB or RGBa
                let settingRaw = currentLine.split("=");

                setting.displayName = getSettingDisplayName(settingRaw[0]);
                setting.name = settingRaw[0];

                settingRaw.shift();
                setting.value = parseRGBa(settingRaw.join("="));

                if(setting.value.a){
                    setting.type = "RGBa";
                } else {
                    setting.type = "RGB";
                }
            } else {
                // it's a regular setting
                let settingRaw = currentLine.split("=");

                setting.displayName = getSettingDisplayName(settingRaw[0]);
                setting.name = settingRaw[0];
                setting.value = settingRaw[1];

                setting.type = getSettingType(setting.value);
            }

            category.settings.push(setting);
        }

        // push the category only if it's not in the array already
        if(!settings.some((e) => e.name == category.name)){
            settings.push(category);
        }
    }

    return settings;
}

function serialiseToConfigString(settings){
    var settingsString = "";

    settings.forEach(function stringifyCategories(category){
        settingsString += "[" + category.name + "]\n";

        category.settings.forEach(function stringifySettings(setting){
            settingsString += setting.name;

            if(setting.type == "RGB" || setting.type == "RGBa"){
                settingsString += "=" + serialiseRGBa(setting.value);
            } else {
                settingsString += "=" + setting.value;
            }

            settingsString +=  "\n";
        })

        settingsString += "\n"; // for readability
    });

    return settingsString;
}

function writeConfigString(path, settings){
    psLog("Serialising settings to config format.");

    settingsString = serialiseToConfigString(settings);

    writeSettingsFile(path, settingsString);

    return true;
}

function readSettingsFile(filePath){
    psLog("Reading settings file.");

    return readFileSync(filePath, "utf8");
}

function writeSettingsFile(path, data){
    psLog(`Writing to settings file "${path}".`);

    writeFileSync(path, data, {encoding: "utf8"});
}

function getSettingDisplayName(settingNameRaw){
    return settingNameRaw.split(/(?=[A-Z])/).join(" ");
}

function getSettingType(value){
    if(value.length == 0){
        return "undefined";
    }

    if(value == "True" || value == "False"){
        return "boolean";
    }

    numberValue = Number(value);
    numberValue = !Number.isNaN(numberValue);

    if(numberValue){
        return "number";
    }

    if(/\(R=\d{1,3},G=\d{1,3},B=\d{1,3}\)/.test(value)){
        return "RGB";
    }

    if(/\(R=\d{1,3},G=\d{1,3},B=\d{1,3},A=\d{1,3}\)/.test(value)){
        return "RGBa";
    }

    return "string";
}

function parseRGBa(configValue){
    configValue = configValue.replace("(", "").replace(")", "");

    var returnObject = {};

    configValue = configValue.split(",");
    for(let colorValue of configValue){
        colorValue = colorValue.split("=");
        returnObject[colorValue[0].toLowerCase()] = Number(colorValue[1]);
    };

    return returnObject;
}

function serialiseRGBa(objRGBa){
    var returnString = "(";

    returnString += `R=${objRGBa.r},G=${objRGBa.g},B=${objRGBa.b}`;

    if(objRGBa.a){
        returnString += `,A=${objRGBa.a}`;
    }

    returnString += ")";

    return returnString;
}

function psLog(msg){
    console.log("vtx-config-ps: " + msg);
}