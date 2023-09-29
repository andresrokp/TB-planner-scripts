const fs = require('fs');

function readInputArrayFromFile(filename) {
  try {
    // read text, parse and return
    const jsonText = fs.readFileSync(filename,'utf-8');
    const inputArray = JSON.parse(jsonText);
    return inputArray;
  } catch (error) {
    // if fs.read or j.parse fail
    console.error('Error reading JSON file:', error.message);
    return [];
  }
}

// Function to convert a label/name object to the datasource form
function convertToTbForm(dataKey) {
    return {
        "name": dataKey.name,
        "type": "attribute",
        "label": dataKey.label,
        "color": "#2196f3",
        "settings": {
            "dataKeyHidden": false,
            "dataKeyType": "server",
            "dataKeyValueType": "select",
            "required": true,
            "isEditable": "editable",
            "selectOptions": [
                {"value": "1", "label": "CUMPLE"},
                {"value": "-1", "label": "NO CUMPLE"},
                {"value": "0", "label": "NO APLICA"}
            ],
            "useCustomIcon": false,
            "useGetValueFunction": false,
            "useSetValueFunction": false
        },
        "_hash": Math.random(),
        "aggregationType": null,
        "units": null,
        "decimals": null,
        "funcBody": null,
        "usePostProcessing": null,
        "postFuncBody": null
    };
}

// Function to get the structure for Buffer
function convertToTbBuffer(dataKey) {
  return {
      "name": dataKey.name,
      "type": "attribute",
      "label": dataKey.label,
      "color": "#3f51b5",
      "settings": {},
      "_hash": Math.random(),
      "aggregationType": null,
      "units": null,
      "decimals": null,
      "funcBody": null,
      "usePostProcessing": null,
      "postFuncBody": null
  };
}

// Function to get the structure for History
function convertToTbHistory(dataKey) {
  return {
    "name": dataKey.name,
    "type": "timeseries",
    "label": dataKey.name,
    "color": "#2196f3",
    "settings": {},
    "_hash": Math.random()
  };
}

function writeJsonToFile(myJsonArray, filename) {
    // convert the object in string
    const myStringArray = JSON.stringify(myJsonArray,null,2);
    // write the file
    fs.writeFileSync(filename,myStringArray,'utf-8')
}

// --------------------------
// --------- Inicio ejecución

// json reading
const filename = 'others/widget-datakeys-generator/widgetDatakeys.json'; // Replace with the path to your JSON file
const inputArray = readInputArrayFromFile(filename);
console.log(inputArray);

// array for FORM structure
const arrayDatakeysF = inputArray.map(convertToTbForm)
const datakeysObjF = {
"dataKeys": arrayDatakeysF
};
// write object in file
const outFileF = 'others/widget-datakeys-generator/formGeneratedDatakeys.json'
writeJsonToFile(datakeysObjF, outFileF)


// build and write for BUFFER structure
const datakeysObjBuffer = {
  "dataKeys": inputArray.map(convertToTbBuffer)
};
writeJsonToFile(datakeysObjBuffer, 'others/widget-datakeys-generator/bufferGeneratedDatakeys.json')

// build and write for HISTORY structure
writeJsonToFile({"dataKeys": inputArray.map(convertToTbHistory)},'others/widget-datakeys-generator/historyGeneratedDatakeys.json')


// TODO: ...some day refactor and unify the processes