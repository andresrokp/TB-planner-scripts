// Define the summary functions
const summaryFunctions = {
  getCountOfOnes: (data) =>
    data.filter((value) => value === 1 || value === true).length,
  getCountOfTrainOfOnes: (data) => {
    let count = 0;
    let currentCount = 0;
    for (const value of data) {
      if (value === 1 || value === true) {
        currentCount++;
      } else {
        if (currentCount > 0) {
          count++;
        }
        currentCount = 0;
      }
    }
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
const dataInstructions = [
  {
    datakeyName: "buzzer",
    summaryFunctions: ["getCountOfOnes", "getCountOfTrainOfOnes"],
  },
  { datakeyName: "temperature", summaryFunctions: ["getMaxValue"] },
  { datakeyName: "deltaFuel", summaryFunctions: ["getSumOfPossitives"] },
  { datakeyName: "hourmeter", summaryFunctions: ["getMaxDifference"] },
  // Add more data key names and summary functions as needed
];

// Parse the input JSON string to get the large JSON array
const jsonArray = JSON.parse(`YOUR_LARGE_JSON_ARRAY`);

// Generate the summary table
const summaryTable = [];
for (const obj of jsonArray) {
  const { datasource, dataKey, data } = obj;
  const datasourceName = datasource.name;
  for (const instruction of dataInstructions) {
    const { datakeyName, summaryFunctions } = instruction;
    if (dataKey.name === datakeyName) {
      for (const summaryFunction of summaryFunctions) {
        if (summaryFunctions[summaryFunction]) {
          const summaryValue = summaryFunctions[summaryFunction](
            data.map(([_, value]) => value)
          );
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
console.log(summaryTable);
