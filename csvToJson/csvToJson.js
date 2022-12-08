// here I will bring in all the classes and create one common method to call all the classes
const csvHandler = require('./Parser/FileParser.js');
const jsonHandler = require('./JsonHandler/jsonHandler.js');


class csvToJson{
    constructor(csvFileLocation, jsonFileLocation){
        this.csvFileLocation = csvFileLocation;
        this.jsonFileLocation = jsonFileLocation;
    }

    // function to convert the csv file to a json object
    convertCsvToJson(){
        // csvHandler
        const csvhandler = new csvHandler(this.csvFileLocation);
        console.log("success");
        const fileContents = csvhandler.readFile();
        console.log("success");
        const jsonObjects = csvhandler.parseFileAndConvertToKeyedJson(fileContents);
        console.log("success");
        csvhandler.writeJsonToFile(jsonObjects);
        console.log("success");

        // jsonHandler
        const jsonhandler = new jsonHandler(this.jsonFileLocation);
        jsonhandler.seperateJsonObjectByKeys();
    }
}
exports = module.exports = csvToJson;