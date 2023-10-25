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
        "name": dataKey.name,
        "type": "attribute",
        "label": dataKey.label,
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

// -------------------------------------
// --------- Inicio ejecución-----------


// input datakey names json loading
const inputFilename = 'others/widget-datakeys-generator/widgetDatakeys.json'; // Replace with the path to your JSON file
const inputArray = readDatakeyValuesArrayFromFile(inputFilename);
console.log(inputArray);
// widget template loading
const folderPath = 'others/widget-datakeys-generator/original_templates';
const filesList = fs.readdirSync(folderPath);
filesList.sort();


// Ordered array to associate generators and pick
const dataKeyGenerators = [
  {
    builder: turnToOperInputForm,
    headElements: 1, // elements to keep at the begining
    tailElements: 5, // elements in the original datakeys array to keep at the end
    outFile: 'others/widget-datakeys-generator/1_operInputFormDatakeys.json',
  },
  {
    builder: turnToOperBuffer,
    headElements: 1, // mark the start of the splice
    tailElements: 5, // used to determine the quantity to delete in splice
    outFile: 'others/widget-datakeys-generator/2_operBufferDatakeys.json',
  },
  {
    builder: turnToAdminHistoryTablita,
    headElements: 0,
    tailElements: 4,
    outFile: 'others/widget-datakeys-generator/3_adminHistoryTablitaDatakeys.json',
  },
  {
    builder: turnToAdminPlotChart,
    headElements: 0,
    tailElements: 0,
    outFile: 'others/widget-datakeys-generator/4_adminPlotChartDatakeys.json',
  },
];


// iterate over the widgets and process it
filesList
  .filter(file => file.endsWith('.json'))
  .forEach( ( file, idx ) =>{

    const widgetPath = `${folderPath}/${file}`;
    const wg = readDatakeyValuesArrayFromFile(widgetPath);

    const dataKeyGenerator = dataKeyGenerators[idx];
    colorIndex = 0;
    const generatedDatakeys = inputArray.map(dataKeyGenerator.builder);
    let wgCurrentDatakeys = wg.widget.config.datasources[0].dataKeys
    const start = dataKeyGenerator.headElements;
    const toDelete = wgCurrentDatakeys.length - dataKeyGenerator.headElements - dataKeyGenerator.tailElements;
    wgCurrentDatakeys.splice(start, toDelete, ...generatedDatakeys);
      
    wg.widget.id = generateRandomLowercaseHexGuid();
        
    writeDatakeyJsonArrayToFile(wg, dataKeyGenerator.outFile);
})

// console.log(widgetsJsonArray);
