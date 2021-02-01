/* import modules */
// built-in modules
const path = require('path');
// custom modules
const { readT21xSheet, writeSheet } = require('../lib/sheetIO');

/* options */

const fileName = process.argv[2];
const sheetName = path.parse(fileName).name.replace(/(\w+\d{4}).+/, '$1');
const outPath = path.join(path.parse(fileName).dir, `${sheetName}.xlsx`);
const cmpData = (a, b) => a['ID'] - b['ID'];

/* main */
const { data } = readT21xSheet(fileName);

const shakedData = shake(data).sort(cmpData);

writeSheet(outPath, sheetName, { data: shakedData });

function shake(records) {
  const classMap = {
    n: 13,
    e: 8,
  };
  const mapper = (record) => {
    const {
      ID,
      NewsId,
      PageType,
      PrintingPage,
      SectionPage,
      SubjectCode,
      DateLine,
      PreMark,
      Mark,
      HeadLine,
      SubHeadLine,
      ByLine,
      NewsText,
    } = record;
    const lastMark = Mark || PreMark;
    const T21Class = classMap[lastMark] || null;
    return {
      ID,
      NewsId,
      PageType,
      PrintingPage,
      SectionPage,
      SubjectCode,
      T21Class,
      DateLine,
      HeadLine,
      SubHeadLine,
      ByLine,
      NewsText,
    };
  };
  return records.map(mapper);
}
