import * as XLSX from 'xlsx';
import { notify } from 'src/notify';

export const readExcelToArray = (file, callback) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      callback(jsonData?.map(row => Object.values(row)));
    } catch (error) {
      console.error('Error reading Excel file:', error);
      notify.error('Failed to read the Excel file. Please try again.');
    }
  };

  reader.readAsArrayBuffer(file);
};

export const writeArrayToExcel = (data, filename) => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Error writing to Excel file:', error);
    notify.error('Failed to create the Excel file. Please try again.');
  }
}

export const scenarioScreensToRefArray = (scenario) => {
  const data = [['Id', 'Screen', 'Field Name', 'Value']];
  scenario.forEach((screen, i) => {
    screen.actions.forEach((action, j) => {
      if (['fill', 'selectOption'].includes(action.action)) {
        data.push([`${i},${j}`, screen.screenName, action.options?.name || action.selector, '']);
      }
    });
  });

  return data;
};

export const checkExcelValidity = (excelData, scenarioScreens) => {
  let canProcess = true;

  excelData.forEach((row, i) => {
    if (i === 0 || !canProcess) return; // Skip header row

    row.forEach((value, j) => {
      if (j >= 3 || !canProcess) return; // Skip 'Value' columns

      if (value !== scenarioScreens[i]?.[j]) {
        canProcess = false;
        notify.error('Uploaded file does not match the scenario structure. Please check the file and try again.');
        return;
      }
    });
  });

  return canProcess;
};
