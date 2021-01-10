#! /usr/bin/env node

'use strict';

/* import modules */
// built-in modules
const path = require('path');
//const fs = require('fs');
const xlsx = require('xlsx');
// custom modules
const { pipe } = require('../lib/ytools').functools;
const { classMark, dupMark } = require('../scripts/premark');
const split = require('../scripts/split');
//const { version, description } = require('../package.json');

/* main */
const programType = process.argv[2];
const inputDataPath = process.argv[3];
const inputAssignPath = programType === 'split' ? process.argv[3] : null;
console.log(process.argv);
const programMap = {
  premark: preMarkAll,
  split: split.main,
};

if (programMap[programType]) {
  programMap[programType](inputDataPath, inputAssignPath);
} else {
  console.log('arg err');
}

/* actions */
function preMarkAll(inputDataPath) {
  const { dir, name: fileName, ext } = path.parse(inputDataPath);
  const newsType = fileName.replace(/(.+)\d{4}(.*)/, '$1');
  const outPath = path.join(dir, `${fileName}-pre${ext}`);
  const { data } = readSheet(0, inputDataPath);
  const preMarkedData = pipe([classMark(newsType), dupMark])(data);
  console.log('pass');

  writeSheet(outPath, 'data', preMarkedData);
}

function readSheet(sheetNumber, xlsxPath) {
  console.log(`Reading the first sheet in ${xlsxPath}`);
  const wb = xlsx.readFile(xlsxPath);
  const sheetName = wb.SheetNames[sheetNumber];
  const sheet = wb.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { defval: null });
  return { data };
}

function writeSheet(xlsxPath, sheetName, data) {
  console.log(`Writing ${sheetName} into ${xlsxPath}`);
  const wb = xlsx.utils.book_new();
  const dataSheet = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(wb, dataSheet, sheetName);
  xlsx.writeFile(wb, xlsxPath);
}
