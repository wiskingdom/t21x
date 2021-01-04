/* import modules */
// built-in modules
const path = require('path');
const fs = require('fs');
// const fs = require('fs');
// custom modules
const { readSheet, writeT21xSheet } = require('../lib/sheetIO');

/* export modules */
module.exports = { main };

/* main */
function main(inputDataPath, inputAssignPath) {
  const { dir, name: fileName, base: fileBaseName, ext } = path.parse(
    inputDataPath
  );
  const timestamp = new Date().getTime().toString();
  const outDirPath = path.join(dir, `${fileName}-${timestamp}`);

  const { data: assignTable } = readSheet(0, inputAssignPath);

  if (validateAssign(fileBaseName, assignTable)) {
    const { data } = readSheet(0, inputDataPath);
    const dataByMonth = groupByMonth(fileBaseName, data);
    const meta = getMeta(fileBaseName, timestamp, assignTable);
    fs.mkdirSync(outDirPath);

    let buffer = [];
    const doAction = ([indexMonth, data]) => {
      const metaByMonth = meta[indexMonth];
      const { Worker } = metaByMonth[0];
      const DataSize = data.length;
      const xlsxPath = path.join(
        outDirPath,
        `${fileName}-${indexMonth}-${Worker}${ext}`
      );
      buffer.push([indexMonth, Worker, DataSize]);
      writeT21xSheet(xlsxPath, {
        data,
        meta: [{ ...metaByMonth[0], DataSize }],
      });
    };

    Object.entries(dataByMonth).forEach(doAction);
    console.log(buffer.sort());
  } else {
    console.log('Assign table is not validated!');
  }
}

//fs.writeFileSync('output/log.json', JSON.stringify(meta, null, 2));

// functions
function getMeta(fileBaseName, timestamp, assignTable) {
  const targetList = assignTable.filter(
    (row) => row['FileName'] === fileBaseName
  );
  const reducer = (acc, curr) => {
    const indexMonth = `${curr['Month']}`.padStart(2, 0);
    acc[indexMonth] = acc[indexMonth] || [];
    acc[indexMonth].push({ ...curr, AssignedAt: timestamp });
    return acc;
  };
  return targetList.reduce(reducer, {});
}

function getIndexMonth(fileYear, singleRow) {
  const { DateLine } = singleRow;
  const [year, month] = `${DateLine}`.match(/^(\d{4})(\d{2})(\d{2})$/).slice(1);
  return year === fileYear ? month : year < fileYear ? '01' : '12';
}

function groupByMonth(fileBaseName, data) {
  const fileYear = fileBaseName.match(/\d{4}/)[0];
  const reducer = (acc, curr) => {
    const indexMonth = getIndexMonth(fileYear, curr);
    acc[indexMonth] = acc[indexMonth] || [];
    acc[indexMonth].push(curr);
    return acc;
  };
  return data.reduce(reducer, {});
}

// eslint-disable-next-line no-unused-vars
function validateData(fileBaseName, data) {
  const fileYear = fileBaseName.match(/\d{4}/)[0];
  const notMatchs = data.filter(
    (row) => !`${row['DateLine']}`.startsWith(fileYear)
  );
  console.log(notMatchs.map((row) => row['DateLine']));
  return notMatchs.length === 0;
}

function validateAssign(fileBaseName, assignTable) {
  const targetList = assignTable.filter(
    (row) => row['FileName'] === fileBaseName
  );
  const cmpAsc = (a, b) => (a > b ? 1 : -1);
  const months = targetList.map((row) => row['Month']).sort(cmpAsc);
  const has12Items = targetList.length === 12;
  const hasAllMonth = numsEqual(months, countUp(12));
  return has12Items && hasAllMonth;
}

function countUp(num) {
  return num === 0 ? [] : [...countUp(num - 1), num];
}

function numsEqual(nums1, nums2) {
  return JSON.stringify(nums1) === JSON.stringify(nums2);
}
