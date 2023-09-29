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
// --------------------------
// --------- Inicio ejecución

// json reading
const filename = 'others/widget-datasource-generator/widgetDatasource.json'; // Replace with the path to your JSON file
const inputArray = readInputArrayFromFile(filename);
console.log(inputArray);

// array form conversion
const arrayDatakeys = inputArray.map(convertToTbForm)
const datakeysObj = {
"dataKeys": arrayDatakeys
};


console.log(JSON.stringify(datakeysObj, null, 2));