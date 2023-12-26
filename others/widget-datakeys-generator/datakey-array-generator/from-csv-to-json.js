
const fs = require('fs');
const csv_parser = require('csv-parser');

let datakeysHashmap = {};

fs.createReadStream(__dirname+'/check-datakeys-map.csv')
    .pipe(csv_parser())
    .on('data',(row)=>{
        // Takes out the gseType prop, and also the rest of the props as rowData
        const { gseType, ...rowsData } = row;
        // Create prop in target
        if(!datakeysHashmap[gseType]) datakeysHashmap[gseType] = [];
        // Fill prop as an array
        datakeysHashmap[gseType].push(rowsData);
    })
    .on('end',()=>{        
        // Get data string form and write to file
        const jsonString = JSON.stringify(datakeysHashmap,null,2);
        fs.writeFileSync(__dirname+'/check-datakeys-tree.json',jsonString)
    })