# Vertex Config Parser and Serialiser

Parser and serialiser for Vertex config files.

The programm reads in a file or a string that follows the UE4 config format and returns it as a JavaScript object.
After reading in a file or string it can serialise the object back to a string and/or write it to a file directly.

## Usage

There are the following functions:

* parseConfigFile
* parseConfigString
* serialiseToConfigString
* writeConfigString