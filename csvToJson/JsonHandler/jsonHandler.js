const backupFileLocation = '../BACKUP/BackupJsonFile/BACKUP.json';
var isBackupEnabled = false;
// I'm creating a global dict that will have generic values that can be used when calling the class
var globalList = [
        "StartDate",
        "EndDate",
        "Status",
        "IPAddress",
        "Progress",
        "Duration (in seconds)",
        "Finished",
        "RecordedDate",
        "ResponseId",
        "RecipientLastName",
        "RecipientFirstName",
        "RecipientEmail",
        "ExternalReference",
        "LocationLatitude",
        "LocationLongitude",
        "DistributionChannel",
        "UserLanguage",
        "Q1",
        "Q7",
        "Q2",
        "Q3",
        "Q4",
        "Q5",
        "Q6_1",
        "Q6_2",
        "Q6_3",
        "Q8",
        "Q9",
        "Q10",
        "Q11",
        "Q12",
        "Q13",
        "Q17",
        "Q18",
        "Q14",
        "Q20",
        "Q21",
        "Q15",
        "Q16",
];

class JsonHandler {
    constructor(jsonFileLocation){
        const fs = require('fs');
        const path = require('path');
        // first we check if the back up json file excists in the backup folder
        // if it does not, then we initialize the json file using the json file location
        this.jsonFileLocation = jsonFileLocation;
        this.valuesList = globalList;

        if (fs.existsSync(path.resolve(__dirname, backupFileLocation), "utf8")){
            // if the file exists, then we read the file and set the json object to the file contents
            this.jsonObject = JSON.parse(fs.readFileSync(path.resolve(__dirname, backupFileLocation), "utf8"));
            isBackupEnabled = true;
        }
        else{
            this.jsonObject = JSON.parse(fs.readFileSync(path.resolve(__dirname, this.jsonFileLocation), "utf8"));
        }
    }

    // function to just grab and return the json object in case of backup
    getJsonObjectFromBackup(){
        if (isBackupEnabled){
            return this.jsonObject;
        }
        else{
            return null;
        }
    }

    // function to clean the json object removing all the empty object and "\n" values
    cleanJsonObject(jsonObject){
        // first we need to remove all the empty objects
        for (let i = 0; i < jsonObject.length; i++){
            if (Object.keys(jsonObject[i]).length === 0){
                jsonObject.splice(i, 1);
            }
        }

        // then we need to remove all the "\n" values
        for (let i = 0; i < jsonObject.length; i++){
            for (let key in jsonObject[i]){
                if (jsonObject[i][key] === "\n"){
                    delete jsonObject[i][key];
                }
            }
        }
        return jsonObject;
    }

    // function to write the json object to the json file
    writeJsonObjectToFile(newJsonArray){
        const fs = require('fs');
        const path = require('path');
        // first we need to clean the json object
        const jsonobj = this.cleanJsonObject(newJsonArray);
        // then we need to write the json object to the json file
        fs.writeFileSync(path.resolve(__dirname, this.jsonFileLocation), JSON.stringify(jsonobj));
    }

    // function to seperate the json object by their keys
    seperateJsonObjectByKeys(){
        // the json object has two types of objects, generic and business
        // if the key is generic, then we can disregard it
        // if the key is business, then we need to seperate it into its own json object with all the other business objects
        // we will do this by creating a new json object and adding the business objects to it
        // then we will add the new json object to the json array

        // first we need to create a new json array
        const newJsonArray = [];
        // then we need to loop through the json object
        for (let i = 0; i < this.jsonObject.length; i++){
            // if the key is generic, then we can disregard it
            if (Object.keys(this.jsonObject[i])[0] === "generic"){
                continue;
            }
            // if the key is business, then we need to seperate it into its own json object with all the other business objects
            else{
                // we will do this by creating a new json object and adding the business objects to it
                const newJsonObject = {[Object.keys(this.jsonObject[i])[0]] : {}};
                // extract the keys from the business object
                const keys = Object.keys(this.jsonObject[i][Object.keys(this.jsonObject[i])[0]]);
                // loop through the keys
                for (let j = 0; j < keys.length; j++){
                    // add the key and value to the new json object
                    newJsonObject[Object.keys(this.jsonObject[i])[0]][keys[j]] = this.jsonObject[i][Object.keys(this.jsonObject[i])[0]][keys[j]];
                }
                // then we will add the new json object to the json array
                newJsonArray.push(newJsonObject);
            }
        }
        this.writeJsonObjectToFile(newJsonArray);
    }

    // given a specific key for the json object, this function will return the entire dict for that key
    getJsonObjectByKey(key){
        // first we need to loop through the json object
        for (let i = 0; i < this.jsonObject.length; i++){
            // if the key is found, then we return the entire dict
            if (Object.keys(this.jsonObject[i])[0] === key){
                return JSON.stringify(this.jsonObject[i]);
            }
        }
        // if the key is not found, then we return null
        return null;
    }

    // a method to take in a json object and search for a specific key and return the value for that key
    getJsonValueByKey(jsonObject, masterKey, key){
        // first parse the json object
        const jsonObj = JSON.parse(jsonObject);
        // then find the value with the given key
        if (jsonObj[masterKey][key] === ""){
            jsonObj[masterKey][key] = "N/A";
        }
        return jsonObj[masterKey][key];
    }

    // overloaded function for getjsonvaluebykey that take in a dict of keys instead of just one key
    getJsonValuesByKeys(jsonObject, masterKey, keys){
        // first parse the json object
        const jsonObj = JSON.parse(jsonObject);
        // then find the value with the given key
        const values = [];
        for (let i = 0; i < keys.length; i++){
            if (jsonObj[masterKey][keys[i]] === ""){
                jsonObj[masterKey][keys[i]] = "N/A";
            }
            values.push(jsonObj[masterKey][keys[i]]);
        }
        return values;
    }

    getJsonSpecificValueAsString(masterKey, key, dictionary = false){
        const jsonKey = this.getJsonObjectByKey(masterKey);
        if (dictionary === false){
            return this.getJsonValueByKey(jsonKey, masterKey, key);
        }
        else{
            return this.getJsonValuesByKeys(jsonKey, masterKey, this.getGlobalListOfKeys());
        }
    }

    // function to get the global dict
    getGlobalListOfKeys(){
        return this.valuesList;
    }
}

exports = module.exports = JsonHandler;

// test the json handler
const jsonHandler = new JsonHandler("../jsonStorage/Alumni.json");
// const jsonObject = jsonHandler.getJsonObjectAsString();
// // console.log(jsonObject);
// const jsonObjectByKey = jsonHandler.getJsonObjectByKey("Business 1");
// // console.log(jsonObjectByKey);
// const jsonValueByKey = jsonHandler.getJsonValueByKey(jsonObjectByKey, "Business 1", "StartDate");
// console.log(jsonValueByKey);

const jsonSpecificValueAsString = jsonHandler.getJsonSpecificValueAsString("Business 1", "RecipientLastName");
console.log(jsonSpecificValueAsString);
