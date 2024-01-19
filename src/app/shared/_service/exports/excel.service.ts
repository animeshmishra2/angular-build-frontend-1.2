import { Injectable } from '@angular/core';
import { AppSetting } from '../../_conf/app-setting';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root',
})

export class ExcelService {
  constructor(private http: HttpClient) {}
  
  exportexcel(fileName:string,List:any[],sheet:string): void {
    /* pass here the table id */
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(List);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheet);
    /* save to file */
    XLSX.writeFile(wb, `${fileName}-${Date.now()}`);
}
public exportAsExcelFile(fileName:string,List:any[],sheet:string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(List);
    const workbook: XLSX.WorkBook = { Sheets: { 'Sheet1': worksheet }, SheetNames: ['Sheet1'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }


  marginReport(fileName,json){
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('My Sheet');
  
    const header:any = ['Barcode', 'Name', 'Category Name', 'Selling Price', 'Purchase Price', 'Selling Margin',' ','Purchase Margin'];
    sheet.addRow(header);
    let subHeader:any = [];
    subHeader[6] = '%age';
    subHeader[7] = 'Amount';
    subHeader[8] = '%age';
    subHeader[9] = 'Amount';
    sheet.addRow(subHeader);
    sheet.mergeCells('F1:G1');
    sheet.mergeCells('H1:I1');
    sheet.mergeCells('A1:A2');
    sheet.mergeCells('B1:B2');
    sheet.mergeCells('C1:C2');
    sheet.mergeCells('D1:D2');
    sheet.mergeCells('E1:E2');
    json.forEach(element => {
    sheet.addRow([element["Barcode"],element["Name"],element["Category Name"],element["Selling Price"],element["Purchase Price"],element["Selling Margin age"],element["Selling Margin amount"],element["Purchase Margin age"],element["Purchase Margin amount"]]);
    });
   


    workbook.xlsx.writeBuffer().then(data=>{
      let blob = new Blob([data],{
        type: EXCEL_TYPE
      })
      FileSaver.saveAs(blob, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    })
   
  }
}