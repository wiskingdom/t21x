// import third-party modules
const xlsx = require('xlsx');

module.exports = {
  readSheet,
  writeSheet,
  readT21xSheet,
  writeT21xSheet,
};

function readSheet(sheetNumber, xlsxPath) {
  console.log(`Reading the first sheet in ${xlsxPath}`);
  const wb = xlsx.readFile(xlsxPath);
  const sheetName = wb.SheetNames[sheetNumber];
  const sheet = wb.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { defval: null });
  return { data };
}

function writeSheet(xlsxPath, sheetName, { data }) {
  console.log(`Writing ${sheetName} into ${xlsxPath}`);
  const wb = xlsx.utils.book_new();
  const dataSheet = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(wb, dataSheet, sheetName);
  xlsx.writeFile(wb, xlsxPath);
}

function readT21xSheet(xlsxPath) {
  console.log(`Reading data and meta sheets in ${xlsxPath}`);
  const wb = xlsx.readFile(xlsxPath);
  const dataSheet = wb.Sheets['data'];
  const metaSheet = wb.Sheets['meta'];
  const data = xlsx.utils.sheet_to_json(dataSheet, { defval: null });
  const meta = xlsx.utils.sheet_to_json(metaSheet, { defval: null });
  return { data, meta };
}

function writeT21xSheet(xlsxPath, { data, meta }) {
  console.log(`Writing data and meta sheets into ${xlsxPath}`);
  const wb = xlsx.utils.book_new();
  const dataSheet = xlsx.utils.json_to_sheet(data);
  const metaSheet = xlsx.utils.json_to_sheet(meta);
  xlsx.utils.book_append_sheet(wb, dataSheet, 'data');
  xlsx.utils.book_append_sheet(wb, metaSheet, 'meta');
  xlsx.writeFile(wb, xlsxPath);
}
