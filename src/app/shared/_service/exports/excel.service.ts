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


  getInventoryReport(fileName,json,body){
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('My Sheet');
    sheet.addRow([`Report Type- ${body.reportName}`])
    sheet.addRow([`Stort/warehouse Name - ${body.warehouseName.name}`])
    sheet.addRow([` `])
    const header = ['Barcode', 'Product Name', 'Category', 'Sub Category', 'Sub Sub Category', 'Brand','Quantity Left'];
    let heading=sheet.addRow(header);
    heading.font = { family: 4, size: 10, bold: true };
    heading.alignment = { horizontal: 'center' }
    json.forEach(element => {
    sheet.addRow([element["Barcode"],element['Product Name'],element['Category'],element['Sub Category'],element['Sub Sub Category'],element['Brand'],element['Quantity Left']]);
    });
    sheet.mergeCells('A1:G1');
    sheet.mergeCells('A2:G2');


    workbook.xlsx.writeBuffer().then(data=>{
      let blob = new Blob([data],{
        type: EXCEL_TYPE
      })
      FileSaver.saveAs(blob, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    })
   
  }
  marginReport(fileName,json,body){
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('My Sheet');
    sheet.addRow([`Report Type- ${body.reportName}`])
    sheet.addRow([`Stort/warehouse Name - ${body.warehouseName.name}`])
    sheet.addRow([` `])
    const header:any = ['Barcode', 'Name', 'Category Name', 'Selling Price', 'Purchase Price', 'Selling Margin',' ','Purchase Margin'];
    let heading=sheet.addRow(header);
    heading.font = { family: 4, size: 10, bold: true };
    heading.alignment = { horizontal: 'center' }
    let subHeader:any = [];
    subHeader[6] = '%age';
    subHeader[7] = 'Amount';
    subHeader[8] = '%age';
    subHeader[9] = 'Amount';
    let subhas =  sheet.addRow(subHeader);

    subhas.font = { family: 4, size: 10, bold: true };
    subhas.alignment = { horizontal: 'center' }
    sheet.mergeCells('A1:G1');
    sheet.mergeCells('A2:G2');
    sheet.mergeCells('F4:G4');
    sheet.mergeCells('H4:I4');
    sheet.mergeCells('A4:A5');
    sheet.mergeCells('B4:B5');
    sheet.mergeCells('C4:C5');
    sheet.mergeCells('D4:D5');
    sheet.mergeCells('E4:E5');
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
  purchaseReport(fileName,json,body){
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('My Sheet');
    sheet.addRow([`Report Type- ${body.reportName}`])
    sheet.addRow([`Stort/warehouse Name - ${body.warehouseName.name}`])
    sheet.addRow([` `])
    const header:any = ["Product Name","Vendor Name", "Category","Sub Category","Brand","HSN","Barcode","MRP","Quantity","Taxable Purchase Price (Rs)","Purchase Price with Tax","Purchase Margin","GST"," "," "," "," "," ","Purchase"];
    let heading=sheet.addRow(header);
    heading.font = { family: 4, size: 10, bold: true };
    heading.alignment = { horizontal: 'center' }
    let subHeader:any = [];
    subHeader[13] = 'CGST Amount';
    subHeader[14] = 'CGST %';
    subHeader[15] = 'SGST Amount';
    subHeader[16] = 'SGST %';
    subHeader[17] = 'IGST Amount';
    subHeader[18] = 'IGST %';
    subHeader[19] = 'Unit Price';
    subHeader[20] = 'Taxable Amount';
    subHeader[21] = 'Amount with tax';
    
    let subhas =  sheet.addRow(subHeader);

    subhas.font = { family: 4, size: 10, bold: true };
    subhas.alignment = { horizontal: 'center' }
    // sheet.mergeCells('A1:G1');
    // sheet.mergeCells('A2:G2');
    // sheet.mergeCells('I4:N4');
    // sheet.mergeCells('O4:Q4');
    // sheet.mergeCells('A4:A5');
    // sheet.mergeCells('B4:B5');
    // sheet.mergeCells('C4:C5');
    // sheet.mergeCells('D4:D5');
    // sheet.mergeCells('E4:E5');
    // sheet.mergeCells('F4:F5');
    sheet.mergeCells('S4:U4');
    sheet.mergeCells('M4:R4');
    json.forEach(element => {
    sheet.addRow([element["Product Name"],element["Vendor Name"],element[ "Category"],element["Sub Category"],element["Brand"],element["HSN"],element["Barcode"],element["MRP"],element["Quantity"],element["Taxable Purchase Price (Rs)"],element["Purchase Price with Tax"],element["Purchase Margin (%)"],element["CGST Amount"],element["CGST %"],element["SGST Amount"],element["SGST %"],element["IGST Amount"],element["IGST %"],element["Unit Price"],element["Amount"],element["Amount with tax"]]);
    });
   


    workbook.xlsx.writeBuffer().then(data=>{
      let blob = new Blob([data],{
        type: EXCEL_TYPE
      })
      FileSaver.saveAs(blob, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    })
   
  }
  salseReport(fileName,json,body){
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('My Sheet');
  
    sheet.addRow([`Report Type- ${body.reportName}`])
    sheet.addRow([`Store Name - ${body.warehouseName.name}`])
    sheet.addRow([` `])
    const header:any = ["Customer Order Id", "Customer Name","Store Name","Payment Mode","Discount Type","Quantity","GST"," ","Amount"," ","Order count"];
    let heading=sheet.addRow(header);
    heading.font = { family: 4, size: 10, bold: true };
    heading.alignment = { horizontal: 'center' }
    let subHeader:any = [];
    subHeader[7] = 'CGST';
    subHeader[8] = 'SGST';
    subHeader[9] = 'Total Discount';
    subHeader[10] = 'Total Amount';
    
    let subhas =  sheet.addRow(subHeader);

    subhas.font = { family: 4, size: 10, bold: true };
    subhas.alignment = { horizontal: 'center' }
    sheet.mergeCells('A1:G1');
    sheet.mergeCells('A2:G2');
    sheet.mergeCells('G4:H4');
    sheet.mergeCells('I4:J4');
    sheet.mergeCells('A4:A5');
    sheet.mergeCells('B4:B5');
    sheet.mergeCells('C4:C5');
    sheet.mergeCells('D4:D5');
    sheet.mergeCells('E4:E5');
    sheet.mergeCells('F4:F5');
    sheet.mergeCells('K4:K5');
    json.forEach(element => {
    sheet.addRow([element["Customer Order Id"],element[ "Customer Name"],element["Store Name"],element["Payment Mode"],element["Discount Type"],element["Quantity"],element["CGST"],element["SGST"],element["Total Discount"],element["Total Amount"],element["Order count"]]);
    });
   


    workbook.xlsx.writeBuffer().then(data=>{
      let blob = new Blob([data],{
        type: EXCEL_TYPE
      })
      FileSaver.saveAs(blob, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    })
   
  }
  ExpiryReport(fileName,json,body){
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('My Sheet');
  
    sheet.addRow([`Report Type- ${body.reportName}`])
    sheet.addRow([`Option Type - ${body.warehouseName}`])
    sheet.addRow([` `])
    const header:any = ['Product Name', 'Expired','Expiring In 30days Amount','Not Expired'];
    let heading=sheet.addRow(header);
    heading.font = { family: 4, size: 10, bold: true };
    heading.alignment = { horizontal: 'center' }

    sheet.mergeCells('A1:G1');
    sheet.mergeCells('A2:G2');

    json.forEach(element => {
    sheet.addRow([element['Product Name'],element['Expired'],element['Expiring In 30days Amount'],element['Not Expired']]);
    });
   


    workbook.xlsx.writeBuffer().then(data=>{
      let blob = new Blob([data],{
        type: EXCEL_TYPE
      })
      FileSaver.saveAs(blob, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    })
   
  }
  COGSReport(fileName,json,body){
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('My Sheet');
  
    sheet.addRow([`Report Type- ${body.reportName}`])
    sheet.addRow([`Store Name - ${body.warehouseName.name}`])
    sheet.addRow([` `])
    const header:any = ['Barcode', 'Brand Name','Product Name','Category Name','Sub Category Name','Sub Sub Category Name','Quantity','COGS','Purchase Price'];
    let heading=sheet.addRow(header);
    heading.font = { family: 4, size: 10, bold: true };
    heading.alignment = { horizontal: 'center' }

    sheet.mergeCells('A1:G1');
    sheet.mergeCells('A2:G2');

    json.forEach(element => {
    sheet.addRow([element['Barcode'],element['Brand Name'],element['Product Name'],element['Category Name'],element['Sub Category Name'],element['Sub Sub Category Name'],element['Quantity'],element['COGS'],element['Purchase Price']]);
    });
   


    workbook.xlsx.writeBuffer().then(data=>{
      let blob = new Blob([data],{
        type: EXCEL_TYPE
      })
      FileSaver.saveAs(blob, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    })
   
  }
}