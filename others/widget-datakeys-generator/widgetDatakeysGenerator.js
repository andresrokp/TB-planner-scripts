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
// function convertToTbHistory(dataKey) {
//   return {
//     "name": dataKey.name,
//     "type": "timeseries",
//     "label": dataKey.name,
//     "color": "#2196f3",
//     "settings": {},
//     "_hash": Math.random()
//   };
// }

function templateAdminHistoryTablita(dataKey) {
  return {
    "name": dataKey.name,
    "type": "timeseries",
    "label": dataKey.label,
    "color": "#2196f3",
    "settings": {
      "useCellStyleFunction": true,
      "cellStyleFunction": "if (value === 0) return {color:'red', fontWeight: 600};",
      "useCellContentFunction": true,
      "cellContentFunction": "return value == 1.0000001 ? \"C\"\n        : value == 1.0000002 ? \"NA\"\n            : \"NC\";"
    },
    "_hash": Math.random(),
    "aggregationType": null,
    "units": null,
    "decimals": null,
    "funcBody": null,
    "usePostProcessing": null,
    "postFuncBody": null
  }
}


const colorList = ['#2196f3','#4caf50','#f44336','#ffc107','#607d8b','#9c27b0','#8bc34a','#3f51b5','#e91e63','#ffeb3b','#03a9f4','#ff9800','#673ab7','#cddc39','#009688','#795548','#00bcd4','#ff5722','#9e9e9e','#2962ff','#00c853','#d50000','#ffab00','#455a64']
let colorIndex = 0
function templateAdminPlotChart(dataKey) {
  return {
    "name": dataKey.name,
    "type": "timeseries",
    "label": dataKey.label,
    "color": colorList[colorIndex++],
    "settings": {},
    "_hash": Math.random(),
    "aggregationType": null,
    "units": null,
    "decimals": null,
    "funcBody": null,
    "usePostProcessing": true,
    "postFuncBody": "return value*100;"
  }
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
writeJsonToFile({"dataKeys": inputArray.map(templateAdminHistoryTablita)},'others/widget-datakeys-generator/historyGeneratedDatakeys.json')

// for Admin Plot graph template
writeJsonToFile({"dataKeys": inputArray.map(templateAdminPlotChart)},'others/widget-datakeys-generator/adminPlotChartDatakeys.json')



// TODO: ...some day refactor and unify the processes