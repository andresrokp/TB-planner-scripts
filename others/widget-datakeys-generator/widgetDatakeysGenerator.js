const fs = require('fs');
require('dotenv').config();

function readJsonFromFile(filename) {
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
const colorList = ["#43a047","#2196f3","#4caf50","#f44336","#ffc107","#607d8b","#9c27b0","#8bc34a","#3f51b5","#e91e63","#ffeb3b","#03a9f4","#ff9800","#673ab7","#cddc39","#009688","#795548","#00bcd4","#ff5722","#9e9e9e","#2962ff","#00c853","#d50000","#ffab00","#455a64","#aa00ff","#64dd17","#304ffe","#c51162","#ffd600","#0091ea","#ff6d00","#6200ea","#aeea00","#00bfa5","#5d4037","#00b8d4","#dd2c00","#616161","#1e88e5","#ffb300","#e53935","#546e7a","#8e24aa"]
let colorIndex = 0

// generate random guid
function generateRandomHexId(length) {
  const characters = '0123456789abcdef';
  let hexId = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    hexId += characters.charAt(randomIndex);
  }

  return hexId;
}

function generateRandomLowercaseHexGuid() {
  // Create a GUID-like pattern: d6e2c4a9-d6e2-c4a9-d6e2-c4a9d6e2c4a9
  const parts = [
    generateRandomHexId(8),
    generateRandomHexId(4),
    generateRandomHexId(4),
    generateRandomHexId(4),
    generateRandomHexId(12)
  ];

  // Join the parts with hyphens and convert
  return parts.join('-');
}


// Function to convert a label/name object to the datasource form
function turnToOperInputForm(dataKey) {
    return {
        "name": dataKey.identifier,
        "type": "attribute",
        "label": dataKey.question,
        "color": colorList[colorIndex++],
        "settings": {
            "dataKeyHidden": false,
            "dataKeyType": "server",
            "dataKeyValueType": "select",
            "required": true,
            "isEditable": "editable",
            "selectOptions": [
              {
                "value": "1",
                "label": "CUMPLE"
              },
              {
                "value": "0",
                "label": "NO CUMPLE"
              },
              {
                "value": "-",
                "label": "NO APLICA"
              }
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
      "name": dataKey.identifier,
      "type": "attribute",
      "label": dataKey.question,
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
    "name": dataKey.identifier,
    "type": "timeseries",
    "label": dataKey.short,
    "color": colorList[colorIndex++],
    "settings": {
      "useCellStyleFunction": false,
      "useCellContentFunction": true,
      "cellContentFunction": "return value == 0 ? '<img style=\"height:25px;\" src=\"https://www.sighums.com/menzies/assets/iconos/circulo_rojo.png\" />'\n    : value == 1 ? '<img style=\"height:25px;\" src=\"https://www.sighums.com/menzies/assets/iconos/check.png\" />'\n    : '-';"
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
    "name": dataKey.identifier,
    "type": "timeseries",
    "label": dataKey.short,
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

// -------------------------------------
// --------- Inicio ejecución-----------


// GUIDING ARRAY
// Load the JSON file where is the datakeys mapping to follow
const inputNamesLabelsFilepath = __dirname+'/datakey-array-generator/check-datakeys-tree.json';
const inputNamesLabelsBigObjectOfArrays = readJsonFromFile(inputNamesLabelsFilepath);
// console.log('inputNamesLabelsBigObjectOfArrays',inputNamesLabelsBigObjectOfArrays);

const GSE_TYPE_TO_TAKE = process.argv[2];
const inputNamesLabelsArray = inputNamesLabelsBigObjectOfArrays[GSE_TYPE_TO_TAKE];

// FILE NAMES ARRAY
// Indicate Windows folders to read the templates and write results
const mainFolderPath = process.env.CHECKLIST_PATH;
const inputWidgetTemplatesDirName = mainFolderPath + 'original_templates/';
const outputWidgetsDirName = mainFolderPath + 'generated_widgets/';
// Load all widget templates' filenames and sort them
const jsonTemplateFilenamesList = fs.readdirSync(inputWidgetTemplatesDirName);
jsonTemplateFilenamesList.sort();
// console.log(jsonTemplateFilenamesList);

// BUILDERS DICTIONARY
// Associate filename with its builder and its slice range (the algorithm should respect some static datakeys at extremes of the widget)
const datakeysObjectBuilders = {
  [jsonTemplateFilenamesList[0]]:{
    builder: turnToOperInputForm,
    headElements: 1, // elements to keep at the begining
    tailElements: 5, // elements in the original datakeys array to keep at the end
    outFile: outputWidgetsDirName + '1_operInputFormDatakeys.json',
  },
  [jsonTemplateFilenamesList[1]]:{
    builder: turnToOperBuffer,
    headElements: 1, // mark the start of the splice
    tailElements: 5, // used to determine the quantity to delete in splice
    outFile: outputWidgetsDirName + '2_operBufferDatakeys.json',
  },
  [jsonTemplateFilenamesList[2]]:{
    builder: turnToAdminHistoryTablita,
    headElements: 1,
    tailElements: 3,
    outFile: outputWidgetsDirName + '3_adminHistoryTablitaDatakeys.json',
  },
  [jsonTemplateFilenamesList[3]]:{
    builder: turnToAdminPlotChart,
    headElements: 0,
    tailElements: 0,
    outFile: outputWidgetsDirName + '4_adminPlotChartDatakeys.json',
  },
};
// console.log('datakeysObjectBuilders',datakeysObjectBuilders);

// FULL-WIDGETS GENERATOR ENGINE LOOP
// Take each widget template (filename) and generate the Full widget related to the inputJsonGuide
jsonTemplateFilenamesList
  .filter(file => file.endsWith('.json')) // exclude the .txt file in dir
  .forEach( ( filename ) =>{
    
    colorIndex = 0; // restart the global color counter

    // get wg and its datakeys array
    const widgetFilePath = inputWidgetTemplatesDirName +'/'+filename;
    const wg = readJsonFromFile(widgetFilePath);
    let wgCurrentDatakeys = wg.widget.config.datasources[0].dataKeys

    // DO STUFF :)
    // get processing parameters
    const dataKeyBuilder = datakeysObjectBuilders[filename];
    const startIndex = dataKeyBuilder.headElements;
    const numElmensToDelete = wgCurrentDatakeys.length - dataKeyBuilder.headElements - dataKeyBuilder.tailElements;
    const generatedDatakeysArray = inputNamesLabelsArray.map(dataKeyBuilder.builder);
    // replace existingVolatileDatakeys in the widgetTemplate's datakeysArray with the generatedDatakeys
    wgCurrentDatakeys.splice(startIndex, numElmensToDelete, ...generatedDatakeysArray);
    // make widget unique
    wg.widget.id = generateRandomLowercaseHexGuid();
    // save da' shi'
    writeDatakeyJsonArrayToFile(wg, dataKeyBuilder.outFile);
})