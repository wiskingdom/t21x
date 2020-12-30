/* import modules */
// built-in modules
const path = require('path');
// const fs = require('fs');
// custom modules
const { readCommonSheet, writeCommonSheet } = require('../lib/sheetIO');

const inputPath = process.argv[2];
const { name, ext } = path.parse(inputPath);

console.log('reading...');
const { data } = readCommonSheet(inputPath, 0);

console.log(data[14243]);

writeCommonSheet(path.join('./output', `${name}_out${ext}`), 'data', { data });
