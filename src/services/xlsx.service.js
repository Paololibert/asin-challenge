#!/usr/bin/env node

const fs = require('fs');
const XLSX = require('xlsx');
const { importData } = require('./db.service');
const path = require('path');
const { program } = require('commander');

// Configuring Commander to accept a file as an argument
program
  .option('-f, --file <path>', 'path to the XLSX file')
  .parse(process.argv);

const options = program.opts();

// Function to read data from stdin
const readStdin = async () => {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => {
      data += chunk;
    });
    process.stdin.on('end', () => {
      resolve(data);
    });
    process.stdin.on('error', reject);
  });
};

// Function to convert dates of birth
const convertDate = (excelDate) => {
  const jsDate = new Date((excelDate - (25567 + 2)) * 86400 * 1000);
  return jsDate.toISOString().split('T')[0];
};

const processXLSX = async (filePath) => {
  try {
    console.time('processXLSX');
    let workbook;
    if (filePath) {
      workbook = XLSX.readFile(filePath);
    } else {
      const input = await readStdin();
      workbook = XLSX.read(input, { type: 'binary' });
    }
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    // Convert birth dates from Excel format to ISO format
    const convertedData = jsonData.map(record => {
      if (typeof record.datedenaissance === 'number') {
        record.datedenaissance = convertDate(record.datedenaissance);
      }
      return record;
    });

    await importData(convertedData);
    console.timeEnd('processXLSX');
    console.log('Importation réussie !');
  } catch (error) {
    console.error("Erreur lors de l'importation :", error);
  }
};

// Call the function with the file path passed as an argument or read from stdin
if (options.file) {
  processXLSX(path.resolve(options.file));
} else {
  processXLSX();
}

module.exports = { processXLSX };
