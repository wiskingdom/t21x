/* import modules */
// built-in modules
const path = require('path');
const fs = require('fs');
// custom modules
const { readSheet, writeSheet } = require('../lib/sheetIO');

const inputDataPath = process.argv[2];

const { name: fileName, ext } = path.parse(inputDataPath);
const outPath = path.join('.', 'output', `${fileName}-ch${ext}`);
const { data } = readSheet(0, inputDataPath);

const naList = fs
  .readFileSync('./data/naList.txt', 'utf-8')
  .trim()
  .split(/[\n\r]+/);

data.forEach((row, i) => {
  if (naList.some((item) => `${row['HeadLine']}`.includes(item))) {
    data[i] = { ...data[i], NS: 'n' };
  } else {
    data[i] = { ...data[i], NS: null };
  }
  if (`${row['HeadLine']}`.includes('사설')) {
    data[i] = { ...data[i], NS: 's' };
  }
});

const reducer = (acc, curr, i, d) => {
  const size = 30;
  const { ID, NewsText } = curr;
  const minIndex = i - size > 0 ? i - size : 0;
  const windows = d.slice(minIndex, i);
  const copys = windows
    .filter((nv) => checkCopy(0.3, 3, nv['NewsText'], NewsText))
    .map((nv) => nv['ID']);
  copys.length > 0 && acc.set(ID, copys);
  console.log(ID);
  return acc;
};

const checkedData = data.reduce(reducer, new Map());
const doAction = ([id, dubIds]) => {
  const markIndex = data.findIndex((row) => row['ID'] === id);
  console.log([id, dubIds]);
  const subMarkIndices = dubIds.map((id) =>
    data.findIndex((row) => row['ID'] === id)
  );
  data[markIndex] = { ...data[markIndex], Dup: id };
  subMarkIndices.forEach(
    (subid) => (data[subid] = { ...data[subid], Dup: id })
  );
};
Array.from(checkedData).forEach(doAction);

writeSheet(outPath, 'data', { data });

// functions
function checkCopy(bar, n, strA, strB) {
  const aSet = new Set(nGrams(n, strA));
  const bSet = new Set(nGrams(n, strB));
  const interSet = intersection(aSet, bSet);
  const interByA = interSet.size / aSet.size;
  const interByB = interSet.size / bSet.size;
  const lesser = interByA < interByB ? interByA : interByB;
  return lesser > bar;
}

function intersection(setA, setB) {
  const reducer = (acc, curr) => {
    setA.has(curr) && acc.add(curr);
    return acc;
  };
  return [...setB].reduce(reducer, new Set());
}

function nGrams(n, str) {
  const maxIndex = n - 1;
  const uniGrams = `${str}`.trim().split(/[\s.?!,]+/);
  const indexPairs = getIndexPairs(maxIndex);
  const indices = indexPairs.map((pair) => pair[0]);
  const jIndices = countUp(uniGrams.length - n);
  const gramsList = indexPairs.map((pair) => uniGrams.slice(...pair));
  const ngramPairs = jIndices.map((j) => indices.map((i) => gramsList[i][j]));

  function getIndexPairs(num) {
    // eslint-disable-next-line no-unused-vars
    function aux(acc, curr) {
      if (curr === num) {
        return [...acc, [curr]];
      } else {
        return aux([...acc, [curr, curr - num]], curr + 1);
      }
    }
    return aux([], 0);
  }

  function countUp(num) {
    return num < 0 ? [] : [...countUp(num - 1), num];
  }

  return ngramPairs.map((pair) => pair.join(' '));
}
