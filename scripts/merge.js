/* import modules */
// built-in modules
const fs = require('fs');
const path = require('path');
// custom modules
const { readT21xSheet, writeT21xSheet } = require('../lib/sheetIO');

/* options */
const dirName = process.argv[2];
const fileNames = fs.readdirSync(dirName).filter((str) => !str.match(/^~\$/));

const recordss = fileNames.map((fileName) =>
  readT21xSheet(path.join(dirName, fileName))
);

const { data, meta } = getDataMeta(recordss);

const stamps = meta.map((record) => record['AssignedAt']);
const isEqStamps = new Set(stamps).size === 1;

const quarters = meta.map((record) => record['Quarter']);
const isUniqQuarters = new Set(quarters).size === quarters.length;
const sizeSum = meta
  .map((record) => record['DataSize'])
  .reduce((acc, curr) => acc + curr, 0);
const ids = data.map((record) => record['ID']);
const isUniqIDs = new Set(ids).size === ids.length;
const isEqTwoSize = ids.length === sizeSum;
console.log(isEqStamps, isUniqQuarters, isUniqIDs, isEqTwoSize);

if (isEqStamps && isUniqQuarters && isUniqIDs && isEqTwoSize) {
  const cmpData = (a, b) => a['ID'] - b['ID'];
  const cmpMeta = (a, b) => a['Quarter'] - b['Quarter'];
  writeT21xSheet(`${dirName}_merged.xlsx`, {
    data: data.sort(cmpData),
    meta: meta.sort(cmpMeta),
  });
} else {
  console.log('not passed with tests');
}

function getDataMeta(recordss) {
  const reducer = ({ data, meta }, curr) => {
    return { data: [...data, ...curr.data], meta: [...meta, ...curr.meta] };
  };
  return recordss.reduce(reducer, { data: [], meta: [] });
}
