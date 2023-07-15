const { log } = require('console');
const fs = require('fs');

// Define the summary functions
const summaryFunctionsDefinitions = {
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
  { datakeyName: "battery", summaryFunctions: ["getMax","getMin"] },
  { datakeyName: "deltaFuel", summaryFunctions: ["getSumOfPossitives"] },
  { datakeyName: "hourmeter", summaryFunctions: ["getMaxDifference"] },
  // Add more data key names and summary functions as needed
];

// Parse the input JSON string to get the large JSON array

// const jsonArray = JSON.parse(fs.readFileSync('widgets/ctxSummaryEngine.js','utf8'));
const jsonArray = JSON.parse(`[
    {
        "datasource": {
            "type": "entity",
            "name": "equipo ensamble",
            "entityAliasId": "b22a5e00-2e0c-0720-c400-427e1ba87101",
            "filterId": null,
            "latestDataKeys": [],
            "aliasName": "vehicles",
            "entityFilter": {
                "type": "deviceType",
                "resolveMultiple": true,
                "deviceType": "MENZIESGSE",
                "deviceNameFilter": ""
            },
            "pageLink": {
                "pageSize": 1024,
                "page": 0,
                "sortOrder": {
                    "key": {
                        "type": "ENTITY_FIELD",
                        "key": "createdTime"
                    },
                    "direction": "DESC"
                }
            },
            "dataReceived": true,
            "entity": {
                "id": {
                    "entityType": "DEVICE",
                    "id": "1c90cf60-1a8c-11ee-9b83-e14509358390"
                },
                "label": "",
                "name": "equipo ensamble"
            },
            "entityId": "1c90cf60-1a8c-11ee-9b83-e14509358390",
            "entityType": "DEVICE",
            "entityName": "equipo ensamble",
            "entityLabel": "",
            "entityDescription": "",
            "generated": true
        },
        "dataKey": {
            "name": "buzzer",
            "type": "timeseries",
            "label": "buzzer",
            "color": "#dd2c00",
            "settings": {},
            "_hash": 0.7592265762531603,
            "hidden": false,
            "inLegend": true,
            "pattern": "buzzer"
        },
        "data": [
            [
                1689365331000,
                "false"
            ],
            [
                1689365421000,
                "true"
            ],
            [
                1689365627000,
                "false"
            ],
            [
                1689365646000,
                "false"
            ],
            [
                1689365661000,
                "true"
            ],
            [
                1689365674000,
                "true"
            ],
            [
                1689365703000,
                "false"
            ],
            [
                1689368334000,
                "false"
            ],
            [
                1689368336000,
                "true"
            ],
            [
                1689368410000,
                "true"
            ]
        ]
    },
    {
        "datasource": {
            "type": "entity",
            "name": "equipo ensamble",
            "entityAliasId": "b22a5e00-2e0c-0720-c400-427e1ba87101",
            "filterId": null,
            "latestDataKeys": [],
            "aliasName": "vehicles",
            "entityFilter": {
                "type": "deviceType",
                "resolveMultiple": true,
                "deviceType": "MENZIESGSE",
                "deviceNameFilter": ""
            },
            "pageLink": {
                "pageSize": 1024,
                "page": 0,
                "sortOrder": {
                    "key": {
                        "type": "ENTITY_FIELD",
                        "key": "createdTime"
                    },
                    "direction": "DESC"
                }
            },
            "dataReceived": true,
            "entity": {
                "id": {
                    "entityType": "DEVICE",
                    "id": "1c90cf60-1a8c-11ee-9b83-e14509358390"
                },
                "label": "",
                "name": "equipo ensamble"
            },
            "entityId": "1c90cf60-1a8c-11ee-9b83-e14509358390",
            "entityType": "DEVICE",
            "entityName": "equipo ensamble",
            "entityLabel": "",
            "entityDescription": "",
            "generated": true
        },
        "dataKey": {
            "name": "battery",
            "type": "timeseries",
            "label": "battery",
            "color": "#616161",
            "settings": {},
            "_hash": 0.26077173185420177,
            "hidden": false,
            "inLegend": true,
            "pattern": "battery"
        },
        "data": [
            [
                1689365331000,
                4.048
            ],
            [
                1689365421000,
                4.048
            ],
            [
                1689365627000,
                4.048
            ],
            [
                1689365646000,
                3.973
            ],
            [
                1689365661000,
                3.948
            ],
            [
                1689365674000,
                3.943
            ],
            [
                1689365703000,
                3.932
            ],
            [
                1689368334000,
                3.465
            ],
            [
                1689368336000,
                3.446
            ],
            [
                1689368410000,
                3.45
            ]
        ]
    }
]`);

// Generate the summary table
const summaryTable = [];
for (const obj of jsonArray) {
  const { datasource, dataKey, data } = obj;
  const datasourceName = datasource.name;
  console.log(datasourceName, dataKey.name);
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
console.log(summaryTable);
