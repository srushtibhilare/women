// excelToJson.js
const XLSX = require('xlsx');
const fs = require('fs');

function convertExcelToJson() {
  try {
    // Read Excel file
    const workbook = XLSX.readFile('womenright.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Create a simplified structure
    const actsData = {};
    jsonData.forEach(row => {
      if (row.Year && row.Act) {
        actsData[row.Year.toString()] = row.Act;
      }
    });

    // Save as text file (JSON format)
    fs.writeFileSync('./src/actsData.txt', JSON.stringify(actsData));
    console.log('Excel file successfully converted to actsData.txt');
  } catch (error) {
    console.error('Error converting Excel file:', error);
  }
}

convertExcelToJson();