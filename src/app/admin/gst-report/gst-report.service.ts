import { Injectable } from '@angular/core';

import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class GstReportService {
  constructor() {}
  // updateCellValue(filePath: string, sheetName: string, cellReference: string, newValue: any): Promise<void> {
  //   const workbook = new ExcelJS.Workbook();

  //   return workbook.xlsx.readFile(filePath).then(() => {
  //     const worksheet = workbook.getWorksheet(sheetName)!;
  //     const cellToUpdate = worksheet.getCell(cellReference);
  //     cellToUpdate.value = newValue;

  //     return workbook.xlsx.writeFile(filePath);
  //   });
  // }

  generateGSTSummary(
    fileToUpload: File,
    sheetName: string,
    cellData: any
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.readFile(fileToUpload, (data) =>
        this.readDataFromFile(
          data,
          sheetName,
          cellData,
          this.updateGSTSummary,
          resolve,
          reject
        )
      );
    });
  }

  generateGST3B(
    fileToUpload: File,
    sheetName: string,
    cellData: any
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.readFile(fileToUpload, (data) =>
        this.readDataFromFile(
          data,
          sheetName,
          cellData,
          this.updateGST3B,
          resolve,
          reject
        )
      );
    });
  }

  private readFile(fileToUpload: File, callback) {
    const reader = new FileReader();
    reader.onload = function () {
      const data = reader.result;
      callback(data);
    };
    reader.readAsArrayBuffer(fileToUpload);
  }

  private readDataFromFile(
    data: any,
    sheetName: string,
    cellData: any,
    updateFunc: Function,
    resolve,
    reject
  ) {
    const workbook = new ExcelJS.Workbook();
    workbook.xlsx
      .load(data)
      .then(() => {
        updateFunc(workbook.getWorksheet(sheetName)!, cellData);
        workbook.xlsx
          .writeBuffer()
          .then((buffer) => {
            const blob = new Blob([buffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            FileSaver.saveAs(blob, 'updated_excel_file.xlsx');
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  }

  private updateGST3B(sheet: ExcelJS.Worksheet, report: any) {
    // Update cells based on the structure of the report object
    sheet.getCell('B2').value = report.legalName;

    // ... Continue updating cells for other sections and fields in your report object
    sheet.getCell('B4').value = report.outwardNonzero.ttv;
    sheet.getCell('C4').value = report.outwardNonzero.integratedTax;
    // ... Repeat this pattern for other fields

    // Example: Update cells for the outwardZero section
    sheet.getCell('B6').value = report.outwardZero.ttv;
    sheet.getCell('C6').value = report.outwardZero.integratedTax;
    // ... Repeat this pattern for other fields in the outwardZero section

    // Continue updating cells for other sections and fields in your report object
  }

  
  private updateGSTSummary(sheet: ExcelJS.Worksheet, report: any) {
    const fromDate = '1/12/2023';
    const toDate = '30/12/2023';
    let title = `GSTR1 DETAILS FOR THE PERIOD ${fromDate} TO ${toDate}`;
    sheet.getCell('B4').value = title;
    report.forEach((section, index: any) => {
      // Assuming the first row is header and the data starts from the second row
      const startRow: number = index + 6;

      Object.entries(section).forEach(([fieldName, value], colIndex) => {
        const columnIndex = colIndex + 1; // Assuming the first column is 'B'
        const cr: string = String.fromCharCode(65 + columnIndex) + startRow; // ASCII code for 'A' is 65
        sheet.getCell(cr).value = value as string | number;
      });
    });
  }

}
