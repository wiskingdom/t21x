// import third-party modules
const xlsx = require('xlsx');

module.exports = {
  readCommonSheet,
  writeCommonSheet,
  readT21xSheet,
  writeT21xSheet,
};

function readCommonSheet(xlsxPath, sheetNumber) {
  const wb = xlsx.readFile(xlsxPath);
  const sheet = wb.Sheets[wb.SheetNames[sheetNumber]];
  const data = xlsx.utils.sheet_to_json(sheet, { defval: '' });
  return { data };
}

function writeCommonSheet(xlsxPath, sheetName, { data }) {
  const wb = xlsx.utils.book_new();
  const dataSheet = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(wb, dataSheet, sheetName);
  xlsx.writeFile(wb, xlsxPath);
}

function readT21xSheet(xlsxPath) {
  const wb = xlsx.readFile(xlsxPath);
  const dataSheet = wb.Sheets['data'];
  const metaSheet = wb.Sheets['meta'];
  const data = xlsx.utils.sheet_to_json(dataSheet, { defval: '' });
  const meta = xlsx.utils.sheet_to_json(metaSheet, { defval: '' });
  return { data, meta };
}

function writeT21xSheet(xlsxPath, { data, meta }) {
  const wb = xlsx.utils.book_new();
  const dataSheet = xlsx.utils.json_to_sheet(data);
  const metaSheet = xlsx.utils.json_to_sheet(meta);
  xlsx.utils.book_append_sheet(wb, dataSheet, 'data');
  xlsx.utils.book_append_sheet(wb, metaSheet, 'meta');
  xlsx.writeFile(wb, xlsxPath);
}
