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



// Inicio ejecución
const filename = 'others/widget-datasource-generator/widgetDatasource.json'; // Replace with the path to your JSON file
const inputArray = readInputArrayFromFile(filename);
console.log(inputArray);
