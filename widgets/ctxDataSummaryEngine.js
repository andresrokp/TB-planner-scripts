const { log } = require('console');
const fs = require('fs');

// Define the summary functions
const summaryFunctionsDefinitions = {
  getCountOfOnes: (data) =>
    data.filter((value) => value === 1 || value === "true").length,
  getCountOfTrainOfOnes: (data) => {
    let count = 0;
    let currentCount = 0;
    for (const value of data) {
      if (value === 1 || value === "true") {
        currentCount++;
      } else {
        // esto nunca considera el escape final
        if (currentCount > 0) {
          count++;
        }
        currentCount = 0;
      }
    }
    // ...por eso usar un backup de final true
    if(data.at(-1) === "true") count++;
    return count;
  },
  getMaxValue: (data) => Math.max(...data),
  getSumOfPossitives: (data) =>
    data.filter((value) => value > 0).reduce((sum, value) => sum + value, 0),
  getSumOFNegatives: (data) =>
    Math.abs(
      data.filter((value) => value < 0).reduce((sum, value) => sum + value, 0)
    ),
  getMaxDifference: (data) => Math.max(...data) - Math.min(...data),
  getMax: (data) => Math.max(...data),
  getMin: (data) => Math.min(...data),
  getMostRepeated: (data) => {
    const countMap = new Map();
    for (const value of data) {
      countMap.set(value, (countMap.get(value) || 0) + 1);
    }
    let mostRepeated = null;
    let maxCount = 0;
    for (const [value, count] of countMap.entries()) {
      if (count > maxCount) {
        mostRepeated = value;
        maxCount = count;
      }
    }
    return mostRepeated;
  },
};

// Define the data instruction array
// esto lo puedo refactorizar a un objeto y evitar el for loop de abajo
// ...how can I instruct gpt in an oppen manner to have it conclude the best way of implement this
const dataInstructions = [
  {
    datakeyName: "buzzer",
    summaryFunctions: ["getCountOfOnes", "getCountOfTrainOfOnes"],
  },
  { datakeyName: "battery", summaryFunctions: ["getMax","getMin"] },
  { datakeyName: "deltaFuel", summaryFunctions: ["getSumOfPossitives"] },
  { datakeyName: "hourmeter", summaryFunctions: ["getMaxDifference"] },
  { datakeyName: "driverUniqueId", summaryFunctions: ["getMostRepeated"] },
  // Add more data key names and summary functions as needed
];

// Parse the input JSON string to get the large JSON array

const jsonArray = JSON.parse(fs.readFileSync('widgets/ctx_data_fragment_mock_data.json','utf8'));
const summaryTable = [];
for (const obj of jsonArray) {
  const { datasource, dataKey, data } = obj;
  const datasourceName = datasource.name;
  console.log(datasourceName, dataKey.name);
  // to refactor: I can change this approach for a dictionary approach if I stick to have just 1 data key name appearance in the dictionary
  for (const instruction of dataInstructions) {
    const { datakeyName, summaryFunctions } = instruction;
    if (dataKey.name === datakeyName) {
      log('>',instruction)
      for (const summaryFunction of summaryFunctions) {
        log('>>',summaryFunction)
        if (summaryFunctionsDefinitions[summaryFunction]) {
          log('>>in')
          const summaryValue = summaryFunctionsDefinitions[summaryFunction](
            data.map(([_, value]) => value)
          );
          log('>>>',summaryValue)
          summaryTable.push({
            datasourceName,
            indicator: { datakeyName, summaryFunction },
            value: summaryValue,
          });
        }
      }
    }
  }
}

// Output the summary table
console.table(summaryTable);
