const csvToJson = require('../csvToJson.js');
const jsonFileLocation = "../jsonStorage/Alumni.json";
const csvFileLocation = "../csvHome/test.csv";
const csvTojson = new csvToJson(csvFileLocation, jsonFileLocation);
csvTojson.convertCsvToJson();
