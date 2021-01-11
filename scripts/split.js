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
  const { dir, name, ext } = path.parse(inputDataPath);
  const fileName = name.match(/.+\d{4}/)[0];
  const fileBaseName = fileName + ext;
  const timestamp = new Date().getTime().toString();
  const outDirPath = path.join(dir, `${fileName}-${timestamp}`);

  const { data: assignTable } = readSheet(0, inputAssignPath);

  if (validateAssign(fileBaseName, assignTable)) {
    const { data } = readSheet(0, inputDataPath);
    const dataByQuarter = groupByQuarter(fileBaseName, data);
    const meta = getMeta(fileBaseName, timestamp, assignTable);
    fs.mkdirSync(outDirPath);

    let buffer = [];
    const doAction = ([indexQuarter, data]) => {
      const metaByQuarter = meta[indexQuarter];
      const { Worker } = metaByQuarter[0];
      const DataSize = data.length;
      const xlsxPath = path.join(
        outDirPath,
        `${fileName}-${indexQuarter}-${Worker}${ext}`
      );
      buffer.push([indexQuarter, Worker, DataSize]);
      writeT21xSheet(xlsxPath, {
        data,
        meta: [{ ...metaByQuarter[0], DataSize }],
      });
    };

    Object.entries(dataByQuarter).forEach(doAction);
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
    const indexQuarter = `${curr['Quarter']}`;
    acc[indexQuarter] = acc[indexQuarter] || [];
    acc[indexQuarter].push({ ...curr, AssignedAt: timestamp });
    return acc;
  };
  return targetList.reduce(reducer, {});
}

function getIndexQuarter(fileYear, singleRow) {
  const { DateLine } = singleRow;
  const [year, month] = `${DateLine}`.match(/^(\d{4})(\d{2})(\d{2})$/).slice(1);
  const qMap = {
    '01': 'q1',
    '02': 'q1',
    '03': 'q1',
    '04': 'q2',
    '05': 'q2',
    '06': 'q2',
    '07': 'q3',
    '08': 'q3',
    '09': 'q3',
    10: 'q4',
    11: 'q4',
    12: 'q4',
  };
  return year === fileYear ? qMap[month] : year < fileYear ? 'q1' : 'q4';
}

function groupByQuarter(fileBaseName, data) {
  const fileYear = fileBaseName.match(/\d{4}/)[0];
  const reducer = (acc, curr) => {
    const indexQuarter = getIndexQuarter(fileYear, curr);
    acc[indexQuarter] = acc[indexQuarter] || [];
    acc[indexQuarter].push(curr);
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
  const quarters = targetList.map((row) => row['Quarter']).sort(cmpAsc);
  const has4Items = targetList.length === 4;
  const hasAllQuarter = qsEqual(quarters, ['q1', 'q2', 'q3', 'q4']);
  return has4Items && hasAllQuarter;
}

function qsEqual(qs1, qs2) {
  return JSON.stringify(qs1) === JSON.stringify(qs2);
}
