const jsonFileLocation = "../jsonStorage/Alumni.json";
var count = 1;

// this class will handle the logic of parsing the csv file, writing it to json so that it can be used in the website
// a helper class will be developed that can be used by max to grab information from the json file
// that helper class will be called jsonHelper.js
class csvHandler {
    // first we need a constructor that will take in the file path and the delimiter, if no delimiter is given then it will default to ;
    constructor(filePath) {
        this.filePath = filePath;
    }

    // this function will read the file and return the contents as a string
    readFile() {
        const fs = require("fs");
        const path = require("path");
        // read the file
        const fileContents = fs.readFileSync(path.resolve(__dirname, this.filePath), "utf8");
        // return the file contents
        return fileContents;
    }

    // this function will parse the file and return the contents as a key json object
    parseFileAndConvertToKeyedJson(stringConents){
        // auto detect the delimiter, since file formats can be different
        const delimiter = this.autoDetectDelimiter(stringConents);

        // split the string into an array of lines
        // we connot split by \n because some of the lines continue on to the next line
        const lines = stringConents.split("\r");
        const keys = lines[0].split(delimiter);
        const jsonObjects = [];
        for(let i = 1; i < lines.length; i++){
            const values = lines[i].split(delimiter);

            // we need to check that the values are the same length as the keys
            if(values.length === keys.length){

                // if the first key does not contain a string with a number in it then we can assume it is generic information
                // so we can add a super key to the json object called "generic"
                // simple logic to check if the first value is a number and add to correspoding json object
                const firstValue = values[0];
                const regex = /\d/;
                const isNumber = regex.test(firstValue);
                const jsonGenericContainerWithKey = {"generic": {}};
                const businessString = "Business " + count;
                const jsonObject = {[businessString] : {}};
                for(let j = 0; j < keys.length; j++){
                    jsonObject[keys[j]] = values[j];
                }
                if(isNumber){
                    jsonObjects.push(jsonObject);
                    count++;
                }
                else{
                    jsonGenericContainerWithKey["generic"] = jsonObject;
                    jsonObjects.push(jsonGenericContainerWithKey);
                }
            }else{

                const manualValues = lines[i].split(this.autoDetectDelimiter(stringConents, true));
                // then we do a manual split
                jsonObjects.push(this.manualSplit(keys, manualValues, delimiter));

            }
        }
        // return the json objects
        return jsonObjects;
    }

    // this function will manually split the values
    manualSplit(keys, values, delimiter){
        // first, we are doing the manual split because the delimiter will not work in this case
        // some values are strings that contain the delimiter

        // find the index of the first delimiter
        const firstDelimiterIndex = values[0].indexOf(delimiter);

        // find the index of the last delimiter
        const lastDelimiterIndex = values[values.length - 1].lastIndexOf(delimiter);

        // get the first value in the string using the first delimiter index
        // sometimes this will return -1, which means that the delimiter is not in the string but we still need to grab the first value
        // so we will just grab the first value and continue on
        var firstValue;
        if(firstDelimiterIndex === -1){
            firstValue =  values[0];
        }
        else{
            firstValue = values[0].substring(0, firstDelimiterIndex);
        }

        // get the last value in the string using the last delimiter index
        const lastValue = values[values.length - 1].substring(lastDelimiterIndex + 1);

        // we need to get the middle values
        // and map them to their corresponding keys
        const middleValues = values.slice(1, values.length - 1);
        const middleKeys = keys.slice(1, keys.length - 1);
        const middleValuesAndKeys = middleValues.map((value, index) => {
            const middleValueAndKey = {};
            middleValueAndKey[middleKeys[index]] = value;
            return middleValueAndKey;
        });

        // simple logic for the master keys
        const regex = /\d/;
        const isNumber = regex.test(firstValue);
        const jsonGenericContainerWithKey = {"generic": {}};
        const businessString = "Business " + count;
        const jsonObjectBusiness = {[businessString] : {}};
        const jsonObject = {};

        // we need to put the values together
        jsonObject[keys[0]] = firstValue;
        middleValuesAndKeys.forEach(middleValueAndKey => {
            jsonObject[Object.keys(middleValueAndKey)[0]] = middleValueAndKey[Object.keys(middleValueAndKey)[0]];
        });
        jsonObject[keys[keys.length - 1]] = lastValue;

        if (isNumber){
            jsonObjectBusiness[businessString] = jsonObject;
            count++;
            return jsonObjectBusiness;
        }
        else{
            jsonGenericContainerWithKey["generic"] = jsonObject;
            return jsonGenericContainerWithKey;
        }
    }

    // this function will auto detect the delimiter
    autoDetectDelimiter(stringContents, ismanualSplit=false){
        if (ismanualSplit){
            // adding regex to handle the formatting of the special case
            const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
            return regex;
            
        }else{
            // for non special cases, we can just split on the new lines, and then use that to determine the delimiter
            const firstLine = stringContents.split("\n")[0];
            const delimiter = firstLine.split(",").length > 1 ? "," : ";";
            return delimiter;
        }
    }

    // this function will write the json to a file
    writeJsonToFile(jsonObjects){
        const fs = require("fs");
        const path = require("path");
        // if there is a file alread there then it will be overwritten
        // we will use the const jsonFileLocation to store the location of the file
        fs.writeFileSync(path.resolve(__dirname, jsonFileLocation), JSON.stringify(jsonObjects));
    }
}
exports = module.exports = csvHandler;
// // now we need to test the class
// const csvHandlerInstance = new csvHandler("../csvHome/test.csv");
// // read the file
// const fileContents = csvHandlerInstance.readFile();
// // parse the file
// const jsonObjects = csvHandlerInstance.parseFileAndConvertToKeyedJson(fileContents);
// // write the json to a file
// csvHandlerInstance.writeJsonToFile(jsonObjects);
