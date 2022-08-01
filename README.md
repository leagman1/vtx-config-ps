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

JSON-conversion or writing to file is not provided.

## Example

```js
function kek(){
    var x = "lel";
}
```