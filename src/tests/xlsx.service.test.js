const { importData } = require('../services/db.service');
const { processXLSX } = require('../services/xlsx.service');
const fs = require('fs');
const path = require('path');
const mockStdin = require('mock-stdin').stdin;

jest.mock('../services/db.service', () => ({
  importData: jest.fn()
}));

test('processXLSX should read and import data from a file', async () => {
  const filePath = path.resolve(__dirname, 'test.xlsx');
  fs.writeFileSync(filePath, 'test data');
  await processXLSX(filePath);
  expect(importData).toHaveBeenCalled();
  fs.unlinkSync(filePath);
});

test('processXLSX should read and import data from stdin', async () => {
  const stdin = mockStdin();
  process.nextTick(() => {
    stdin.send('test data').end();
  });
  await processXLSX();
  expect(importData).toHaveBeenCalled();
});

