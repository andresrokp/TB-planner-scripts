const fs = require('fs');

function readDatakeyValuesArrayFromFile(filename) {
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

// 'global' variable to track color setting
const colorList = ['#2196f3','#4caf50','#f44336','#ffc107','#607d8b','#9c27b0','#8bc34a','#3f51b5','#e91e63','#ffeb3b','#03a9f4','#ff9800','#673ab7','#cddc39','#009688','#795548','#00bcd4','#ff5722','#9e9e9e','#2962ff','#00c853','#d50000','#ffab00','#455a64']
let colorIndex = 0

// Function to convert a label/name object to the datasource form
function turnToOperInputForm(dataKey) {
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
function turnToOperBuffer(dataKey) {
  return {
      "name": dataKey.name,
      "type": "attribute",
      "label": dataKey.label,
      "color": colorList[colorIndex++],
      "settings": {},
      "_hash": Math.random(),
      "aggregationType": null,
      "units": null,
      "decimals": null,
      "funcBody": null,
      "usePostProcessing": true,
      "postFuncBody": "const valueMap = {\n    1:\"C\",\n    '-': \"NA\",\n    0: \"NC\"\n};\nreturn valueMap[value] || \"\";"
  };
}


function turnToAdminHistoryTablita(dataKey) {
  return {
    "name": dataKey.name,
    "type": "timeseries",
    "label": dataKey.label,
    "color": colorList[colorIndex++],
    "settings": {
      "useCellStyleFunction": true,
      "cellStyleFunction": "if (value === 0) return {color:'red', fontWeight: 600};\r\nif (value === 1) return {fontWeight: 600};\r\nreturn {};",
      "useCellContentFunction": true,
      "cellContentFunction": "const valueMap = {\r\n    1:\"C\",\r\n    0: \"NC\"\r\n};\r\nreturn valueMap[value] || \"NA\";"
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


function turnToAdminPlotChart(dataKey) {
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



function writeDatakeyJsonArrayToFile(myJsonArray, filename) {
    // convert the object in string
    const myStringArray = JSON.stringify(myJsonArray,null,2);
    // write the file
    fs.writeFileSync(filename,myStringArray,'utf-8')
}

// --------------------------
// --------- Inicio ejecución

// input datakey names json reading
const filename = 'others/widget-datakeys-generator/widgetDatakeys.json'; // Replace with the path to your JSON file
const inputArray = readDatakeyValuesArrayFromFile(filename);
console.log(inputArray);

// build array for Oper Form structure
const arrayDatakeysF = inputArray.map(turnToOperInputForm)
const datakeysObjF = {
  "dataKeys": arrayDatakeysF
};
// write object in file
const outFileF = 'others/widget-datakeys-generator/operInputFormDatakeys.json'
writeDatakeyJsonArrayToFile(datakeysObjF, outFileF)


// build and write for Oper Buffer structure
const datakeysObjBuffer = {
  "dataKeys": inputArray.map(turnToOperBuffer)
};
writeDatakeyJsonArrayToFile(datakeysObjBuffer, 'others/widget-datakeys-generator/operBufferDatakeys.json')

// build and write for Admin History structure
colorIndex = 0;
writeDatakeyJsonArrayToFile({"dataKeys": inputArray.map(turnToAdminHistoryTablita)},'others/widget-datakeys-generator/adminHistoryTablitaDatakeys.json')

// for Admin Plot graph template
colorIndex = 0;
writeDatakeyJsonArrayToFile({"dataKeys": inputArray.map(turnToAdminPlotChart)},'others/widget-datakeys-generator/adminPlotChartDatakeys.json')



// TODO: ...some day refactor and unify the processes