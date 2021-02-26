/* import modules */
// built-in modules
const path = require('path');
const fs = require('fs');
// const fs = require('fs');
// custom modules
const { readSheet, writeSheet } = require('../lib/sheetIO');

/* export modules */
module.exports = { main };

/* main */
function main(inputDataPath) {
  const { dir, name, base } = path.parse(inputDataPath);
  const outDir = path.join(dir, 'output');
  fs.mkdirSync(outDir, { recursive: true });
  const outDataPath = path.join(outDir, base);
  const outLogPath = path.join(outDir, `${name}.log`);
  const cmpData = (a, b) => a['ID'] - b['ID'];
  const { data } = readSheet(0, inputDataPath);
  const { newData, logs } = dupMark(data.sort(cmpData));

  writeSheet(outDataPath, name, { data: newData });
  fs.writeFileSync(outLogPath, logs.join('\n'));
}

/* functions */
function dupMark(data) {
  // 중복기사 추정 데이터 추출 - 최적화 위해 reduce 대신 for 구문 사용
  const dupMap = new Map(); // acc
  const searchSize = 300;
  for (let i = 0; i < data.length; i++) {
    const { ID, NewsText } = data[i];
    const minIndex = i - searchSize > 0 ? i - searchSize : 0;
    const searchTargets = data.slice(minIndex, i);
    const copys = searchTargets
      .filter((row) => checkSimilar(0.4, 4, row['NewsText'], NewsText))
      .map((row) => row['ID']);
    copys.length > 0 && dupMap.set(ID, copys);
    process.stdout.write(`Checking redundancy with ID:${ID}\r`);
  }
  console.log('Checking redundancy');
  // 중복 추정 아이디 후방 파급 적용
  for (let entry of dupMap) {
    const [id, dubIds] = entry;
    const backDubIds = dubIds
      .map((dubId) => (dupMap.has(dubId) ? dupMap.get(dubId) : []))
      .reduce((acc, curr) => [...acc, ...curr], []);
    dupMap.set(id, [...new Set([...dubIds, ...backDubIds])]);
  }
  const buffer = [];
  let nChanged = 0;
  // 중복기사 추정 데이터 마킹
  for (let entry of dupMap) {
    const [id, dubIds] = entry;
    const markIndex = data.findIndex((row) => row['ID'] === id);
    const subMarkIndices = dubIds.map((id) =>
      data.findIndex((row) => row['ID'] === id)
    );
    const mergeIndices = [markIndex, ...subMarkIndices];
    const cmpData = (a, b) => data[a]['ID'] - data[b]['ID'];
    const not13Indices = mergeIndices
      .filter((subid) => data[subid]['T21Class'] !== 13)
      .sort(cmpData);
    /*
    for (let subid of mergeIndices) {
      data[subid] = { ...data[subid], DupID: id };
    }
    */
    if (not13Indices.length > 1) {
      const [theLastID, ...targetIndices] = not13Indices.reverse();
      for (let subid of targetIndices.reverse()) {
        const targetData = data[subid];
        data[subid] = {
          ...targetData,
          T21Class: 13,
        };
        buffer.push(
          `${id}\tset13Class\t${targetData.ID}\t${targetData.T21Class}->13\t${targetData.DateLine}\t${targetData.HeadLine}`
        );
        nChanged += 1;
      }
      buffer.push(
        `${id}\ttheLastID\t${data[theLastID].ID}\t${data[theLastID].T21Class}->${data[theLastID].T21Class}\t${data[theLastID].DateLine}\t${data[theLastID].HeadLine}`
      );
      buffer.push('');
    }
  }
  const logs = [
    `n of new entries set 13: ${nChanged}`,
    'dupID\tresult\tID\tclass\tdateLine\theadLine',
    ...buffer,
  ];
  return { newData: data, logs };
}

function checkSimilar(bar, n, strA, strB) {
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
  //const uniGrams = `${str}`.trim().split(/[\s.?!,]+/);
  const uniGrams = `${str}`.trim().split(/\s+/);
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
