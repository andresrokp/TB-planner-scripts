
const fs = require('fs');
const csv_parser = require('csv-parser');

let datakeysHashmap = {};

fs.createReadStream(__dirname+'/check-datakeys-map.csv')
    .pipe(csv_parser())
    .on('data',(row)=>{
        console.log(row);
        const { gseType, ...rowsData } = row;
        console.log(rowsData);
        if(!datakeysHashmap[gseType]) datakeysHashmap[gseType] = [];
        datakeysHashmap[gseType].push(rowsData);
    })
    .on('end',()=>{
        console.log(datakeysHashmap);
    })