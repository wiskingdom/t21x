/* import modules */
// built-in modules
const fs = require('fs');
// third-party modules
const xlsx = require('xlsx');
// custom modules
const { pipe, logTap } = require('../lib/ytools').functools;

/* define options */
const inputPath = './data/han2014.xlsx';
const outputPath = './output/irrWords.txt';
const irrRe = /[^가-힣\w.?![\](){}<>''"",“”‘’·ㆍ…~_\-%+*/\\]/;

/* run */
const pipeLine = [
  logTap(getCol('본문 내용'), 'getting contents...'),
  logTap(getTokens, 'getting tokens...'),
  logTap(getFreq, 'getting freqs...'),
  logTap(getIrrTypes(irrRe), 'getting irrTypes...'),
];

console.log('reading...');
const wb = xlsx.readFile(inputPath);
const sheet = wb.Sheets[wb.SheetNames[0]];

const records = xlsx.utils.sheet_to_json(sheet);

const irrTypes = pipe(pipeLine)(records);

console.log('writing...');
fs.writeFileSync(outputPath, irrTypes.join('\n'));

/* define functions */
function getCol(colName) {
  return (records) => records.map((record) => record[colName]);
}

function getTokens(strs) {
  const reducer = (acc, curr) => {
    const tokens = typeof curr === 'string' ? curr.split(/\s+/) : [];
    acc.push(...tokens);
    return acc;
  };
  return strs.reduce(reducer, []);
}

function getFreq(tokens) {
  const reducer = (acc, curr) => {
    const freq = acc.has(curr) ? acc.get(curr) : 0;
    return acc.set(curr, freq + 1);
  };
  return tokens.reduce(reducer, new Map());
}

function getIrrTypes(irrRe) {
  return (freqs) => [...freqs.keys()].filter((type) => type.match(irrRe));
}
