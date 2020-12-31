/* import modules */
// built-in modules
const path = require('path');
// const fs = require('fs');
// custom modules
const { readSheet, writeSheet } = require('../lib/sheetIO');

const inputPath = process.argv[2];
const { name, ext } = path.parse(inputPath);

const { data } = readSheet(0, inputPath);

console.log(data[14243]);

writeSheet(path.join('./output', `${name}_out${ext}`), 'data', { data });
