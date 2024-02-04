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
    const header:any = Object.keys(json[0])
    let heading=sheet.addRow(header);
    heading.eachCell((cell, number) => {

      cell.font = { family: 4, size: 12, bold: true };
      cell.alignment = { horizontal: 'center' }
    })
    sheet.mergeCells('A1:G1');
    sheet.mergeCells('A2:G2');
    json.forEach((row: any) => {
      sheet.addRow(Object.values(row))
    })
   
    sheet.columns.forEach((column:any) => {
      const lengths = column.values.map(v => v.toString().length);
      const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'));
      column.width = maxLength;
    });

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
    const header:any = ['Barcode','Brand', 'Name', 'Category Name', 'Sub Category Name','HSN', 'Selling Price', 'Purchase Price','MRP','Discount', 'Selling Margin',' ','Purchase Margin',' ','Discount Margin'];
   
    let heading=sheet.addRow(header);
    heading.font = { family: 4, size: 10, bold: true };
    heading.alignment = { horizontal: 'center' }
    let subHeader:any = [];
    subHeader[11] = '%age';
    subHeader[12] = 'Amount';
    subHeader[13] = '%age';
    subHeader[14] = 'Amount';
    subHeader[15] = '%age';
    subHeader[16] = 'Amount';
    let subhas =  sheet.addRow(subHeader);

    subhas.font = { family: 4, size: 10, bold: true };
    subhas.alignment = { horizontal: 'center' }
    sheet.mergeCells('A1:G1');
    sheet.mergeCells('A2:G2');
    sheet.mergeCells('K4:L4');
    sheet.mergeCells('M4:N4');
    sheet.mergeCells('O4:P4');
    sheet.mergeCells('A4:A5');
    sheet.mergeCells('B4:B5');
    sheet.mergeCells('C4:C5');
    sheet.mergeCells('D4:D5');
    sheet.mergeCells('E4:E5');
    sheet.mergeCells('F4:F5');
    sheet.mergeCells('G4:G5');
    sheet.mergeCells('H4:H5');
    sheet.mergeCells('I4:I5');
    sheet.mergeCells('J4:J5');
    json.forEach(element => {
    sheet.addRow([element["Barcode"],element['Brand'],element["Name"],element["Category Name"],element['Sub Category Name'],element['HSN'],element["Selling Price"],element["Purchase Price"],element['MRP'],element['Discount'],element["Selling Margin age"],element["Selling Margin amount"],element["Purchase Margin age"],element["Purchase Margin amount"],element["Discount Margin age"],element['Discount Margin amount']]);
    });
   
    sheet.columns.forEach((column:any) => {
      const lengths = column.values.map(v => v.toString().length);
      const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'));
      column.width = maxLength;
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
    const header:any = ["Barcode", "Bill Number","Brand","Product Name","Vendor Name", "Category","Sub Category","HSN","Expiry","Quantity","MRP","GST"," "," "," "," "," ","Purchase"];
    let heading=sheet.addRow(header);
    heading.font = { family: 4, size: 10, bold: true };
    heading.alignment = { horizontal: 'center' }
    let subHeader:any = [];
    subHeader[12] = 'CGST Amount';
    subHeader[13] = 'CGST %';
    subHeader[14] = 'SGST Amount';
    subHeader[15] = 'SGST %';
    subHeader[16] = 'IGST Amount';
    subHeader[17] = 'IGST %';
    subHeader[18] = 'Purchase Price';
    subHeader[19] = 'Taxable Amount';
    subHeader[20] = 'Amount with tax';
    
    let subhas =  sheet.addRow(subHeader);

    subhas.font = { family: 4, size: 10, bold: true };
    subhas.alignment = { horizontal: 'center' }
    sheet.mergeCells('A1:G1');
    sheet.mergeCells('A2:G2');
    sheet.mergeCells('L4:Q4');
    sheet.mergeCells('R4:T4');
    sheet.mergeCells('A4:A5');
    sheet.mergeCells('B4:B5');
    sheet.mergeCells('C4:C5');
    sheet.mergeCells('D4:D5');
    sheet.mergeCells('E4:E5');
    sheet.mergeCells('F4:F5');
    sheet.mergeCells('G4:G5');
    sheet.mergeCells('H4:H5');
    sheet.mergeCells('I4:I5');
    sheet.mergeCells('J4:J5');
    sheet.mergeCells('K4:K5');
    json.forEach(element => {
    sheet.addRow([element["Barcode"],element["Bill Number"],element["Brand"],element["Product Name"],element["Vendor Name"],element[ "Category"],element["Sub Category"],element["HSN"],element["Expiry"],element["Quantity"],element["MRP"],element["CGST Amount"],element["CGST %"],element["SGST Amount"],element["SGST %"],element["IGST Amount"],element["IGST %"],element["Purchase Price"],element["Taxable Amount"],element["Amount with tax"]]);
    });
   
    sheet.columns.forEach((column:any) => {
      const lengths = column.values.map(v => v.toString().length);
      const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'));
      column.width = maxLength;
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
    const header:any = ["Barcode", "Customer Order Id","Customer Name","Store Name","Brand","Category Name","Sub Category Name","Payment Mode","Discount Type","Quantity","MRP","Purchase Price","Selling Price","GST"," ","Amount"," "];
    let heading=sheet.addRow(header);
    heading.font = { family: 4, size: 10, bold: true };
    heading.alignment = { horizontal: 'center' }
    let subHeader:any = [];
    subHeader[14] = 'CGST';
    subHeader[15] = 'SGST';
    subHeader[16] = 'Total Discount';
    subHeader[17] = 'Total Amount';
    
    let subhas =  sheet.addRow(subHeader);

    subhas.font = { family: 4, size: 10, bold: true };
    subhas.alignment = { horizontal: 'center' }
    sheet.mergeCells('A1:G1');
    sheet.mergeCells('A2:G2');
    sheet.mergeCells('N4:O4');
    sheet.mergeCells('P4:Q4');
    sheet.mergeCells('A4:A5');
    sheet.mergeCells('B4:B5');
    sheet.mergeCells('C4:C5');
    sheet.mergeCells('D4:D5');
    sheet.mergeCells('E4:E5');
    sheet.mergeCells('F4:F5');
    sheet.mergeCells('G4:G5');
    sheet.mergeCells('H4:H5');
    sheet.mergeCells('I4:I5');
    sheet.mergeCells('J4:J5');
    sheet.mergeCells('K4:K5');
    sheet.mergeCells('L4:L5');
    sheet.mergeCells('M4:M5');
    json.forEach(element => {
    sheet.addRow([element["Barcode"],element["Customer Order Id"],element[ "Customer Name"],element["Store Name"],element["Brand"],element["Category Name"],element["Sub Category Name"],element["Payment Mode"],element["Discount Type"],element["Quantity"],element["MRP"],element['Purchase Price'],element["Selling Price"],element["CGST"],element["SGST"],element["Total Discount"],element["Total Amount"]]);
    });
   
    sheet.columns.forEach((column:any) => {
      const lengths = column.values.map(v => v.toString().length);
      const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'));
      column.width = maxLength;
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
  commanSalseReport(fileName,json,body){
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('My Sheet');
  
    sheet.addRow([`Report Type- ${body.reportName}`])
    sheet.addRow([`Store Name - ${body.warehouseName.name}`])
    sheet.addRow([`Type- ${body.report_type}`])
    sheet.addRow([` `])

    const header:any = Object.keys(json[0])
    let heading=sheet.addRow(header);
    heading.eachCell((cell, number) => {

      cell.font = { family: 4, size: 12, bold: true };
      cell.alignment = { horizontal: 'center' }
    })

    sheet.mergeCells('A1:G1');
    sheet.mergeCells('A2:G2');
    sheet.mergeCells('A3:G3');

    json.forEach((row: any) => {
      sheet.addRow(Object.values(row))
    })
   
    sheet.columns.forEach((column:any) => {
      const lengths = column.values.map(v => v.toString().length);
      const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'));
      column.width = maxLength;
    });

    workbook.xlsx.writeBuffer().then(data=>{
      let blob = new Blob([data],{
        type: EXCEL_TYPE
      })
      FileSaver.saveAs(blob, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    })
   
  }
  OrderReport(fileName,json,body){
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('My Sheet');
  
    sheet.addRow([`Report Type- ${body.reportName}`])
    sheet.addRow([`Store Name - ${body.warehouseName.name}`])
    sheet.addRow([` `])
    const header:any = ['Order ID', 'Customer Name','Store Name','Quantity','Discount Type','Total Discount','GST',' ','Profit',' ','Price','Created Date','No of Products'];
    let heading=sheet.addRow(header);
    heading.eachCell((cell, number) => {

      cell.font = { family: 4, size: 12, bold: true };
      cell.alignment = { horizontal: 'center' }
    })
    let subHeader:any = [];
    subHeader[7] = 'CGST %';
    subHeader[8] = 'SGST %';
    subHeader[9] = 'Profit %';
    subHeader[10] = 'Profit(Rs)';
    
    let subhas =  sheet.addRow(subHeader);

    subhas.eachCell((cell, number) => {

      cell.font = { family: 4, size: 12, bold: true };
      cell.alignment = { horizontal: 'center' }
    })
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
    sheet.mergeCells('L4:L5');
    sheet.mergeCells('M4:M5');
    json.forEach((row: any) => {
      let temrow =sheet.addRow([row["Order ID"],row["Customer Name"],row["Store Name"],row["Quantity"],row["Discount Type"],row["Total Discount"],row["CGST"],row["SGST"],row["Profit"],row["Profit(Rs)"],row["Price"],row["Created Date"],row["No of Products"]])
   if(row['isLoss']==1){
    temrow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "FFFF7D7D"
      },
      bgColor: {
        argb: "FF000000"
      }
    }
   }
   
    })
    sheet.columns.forEach((column:any) => {
      const lengths = column.values.map(v => v.toString().length);
      const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'));
      column.width = maxLength;
    });


    workbook.xlsx.writeBuffer().then(data=>{
      let blob = new Blob([data],{
        type: EXCEL_TYPE
      })
      FileSaver.saveAs(blob, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    })
   
  }
  yearOverYeraReport(fileName,json,body){
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('My Sheet');
  
    sheet.addRow([`Report Type- ${body.reportName}`])
    sheet.addRow([`Store Name - ${body.warehouseName.name}`])
    sheet.addRow([`Type- ${body.report_type}-${body.year}`])
    sheet.addRow([` `])

    const header:any = Object.keys(json[0])
    let heading=sheet.addRow(header);
    heading.eachCell((cell, number) => {

      cell.font = { family: 4, size: 12, bold: true };
      cell.alignment = { horizontal: 'center' }
    })

    sheet.mergeCells('A1:G1');
    sheet.mergeCells('A2:G2');
    sheet.mergeCells('A3:G3');

    json.forEach((row: any) => {
      sheet.addRow(Object.values(row))
    })
   
    sheet.columns.forEach((column:any) => {
      const lengths = column.values.map(v => v.toString().length);
      const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'));
      column.width = maxLength;
    });

    workbook.xlsx.writeBuffer().then(data=>{
      let blob = new Blob([data],{
        type: EXCEL_TYPE
      })
      FileSaver.saveAs(blob, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    })
   
  }
  gstR1Report(fileName,json,body){
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('My Sheet');
  
    sheet.addRow([`Report Type- ${body.reportName}`])
    sheet.addRow([`Store Name - ${body.warehouseName.name}`])
    sheet.addRow([`Type- ${body.reportType}`])
    sheet.addRow([` `])

    const header:any = Object.keys(json[0])
    let heading=sheet.addRow(header);
    heading.eachCell((cell, number) => {

      cell.font = { family: 4, size: 12, bold: true };
      cell.alignment = { horizontal: 'center' }
    })

    sheet.mergeCells('A1:G1');
    sheet.mergeCells('A2:G2');
    sheet.mergeCells('A3:G3');

    json.forEach((row: any) => {
      sheet.addRow(Object.values(row))
    })
   
    sheet.columns.forEach((column:any) => {
      const lengths = column.values.map(v => v.toString().length);
      const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'));
      column.width = maxLength;
    });

    workbook.xlsx.writeBuffer().then(data=>{
      let blob = new Blob([data],{
        type: EXCEL_TYPE
      })
      FileSaver.saveAs(blob, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    })
   
  }
  gstR2Report(fileName,json,body){
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('My Sheet');
  
    sheet.addRow([`Report Type- ${body.reportName}`])
    sheet.addRow([`Store Name - ${body.warehouseName.name}`])
    sheet.addRow([`Type- ${body.reportType}`])
    sheet.addRow([` `])

    const header:any = Object.keys(json[0])
    let heading=sheet.addRow(header);
    heading.eachCell((cell, number) => {

      cell.font = { family: 4, size: 12, bold: true };
      cell.alignment = { horizontal: 'center' }
    })

    sheet.mergeCells('A1:G1');
    sheet.mergeCells('A2:G2');
    sheet.mergeCells('A3:G3');

    json.forEach((row: any) => {
      sheet.addRow(Object.values(row))
    })
   
    sheet.columns.forEach((column:any) => {
      const lengths = column.values.map(v => v.toString().length);
      const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'));
      column.width = maxLength;
    });

    workbook.xlsx.writeBuffer().then(data=>{
      let blob = new Blob([data],{
        type: EXCEL_TYPE
      })
      FileSaver.saveAs(blob, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    })
   
  }
}