# Vertex Config Parser and Serialiser

Parser and serialiser for Vertex config files.

The programm reads in a file or a string that follows the UE4 config format and returns it as a JavaScript object.
After reading in a file or string it can serialise the object back to a string and/or write it to a file directly.

## Usage

Require the file inside your JavaScript project and call the functions listed below.

## Functionality
There are the following functions:

* parseConfigFile (Path: filePath) => Array
* parseConfigString (String: configString) => Array
* serialiseToConfigString (Object: settings) => String
* writeConfigString (Path: path, Object: settings) => Boolean

Currently it's very rudimentary. It's expected you do any necessary checks and formatting of paths and so on.
The main functions are `parseConfigFile` and `writeConfigString`. The other two are for convenience.

JSON-conversion or writing JSON to file is not provided.

`parseConfigFile` takes a path to a file as an argument and returns an array of setting categories as parsed sequentially.
Each category has a display name, a name and an array of settings belonging to the category. The display name is provided for use with websites.

Example category structure:
```json
{
    "displayName": "Test Category",
    "name": "TestCategory",
    "settings": []
}
```

Each settings array holds a number of settings objects of the following form:
```json
{
    "displayName": "Example Property XDD",
    "name": "ExampleProperty_XDD",
    "value": "<value>",
    "type": 
}
```

The display name splits camel case words and removes underscores.
Each settings has a type property. The type property defines which type of value the value property will have.
Similar to the display name property, the type is to ease possible development of front end forms.

The programm currently distinguishes between six value types:
* boolean: indicates a string of either "True" or "False"
* number: indicates a string that holds an integer or a floating point number
* string: indicates either a regular string or a data type that isn't currently being recognised
* undefined: indicates an empty string
* RGB: indicates an RGB object (see below)
* RGBa: indicates an RGBa object (see below)

### RGB and RGBa objects

When a setting has the type of "RGB" or "RGBa", the value will be an object that holds the respective RGB/RGBa values as properties:
```json
{
    "r": 200,
    "g": 12,
    "b": 0,
    "a": 120
}
```

## Example

Example code from a fictive nodejs app, for example a Vertex server control panel.

```js
var configPS = require("./configPS.js");

app.get("/controlPanel", (req, res) => {
    var serverSettings = configPS.parseConfigFile("C:\\Vertex\\Server\\MCS\\Saved\\Config\\WindowsServer\\Game.ini");

    res.render(/* some server side render logic, that uses the settings */);
});


app.post("/saveToFile", (req, res) => {
    var settings = JSON.parse(req.XYZ); // retrieve JSON from request
    configPS.writeConfigString("C:\\Vertex\\Server\\MCS\\Saved\\Config\\WindowsServer\\Game.ini", settings);

    // ...
});
```