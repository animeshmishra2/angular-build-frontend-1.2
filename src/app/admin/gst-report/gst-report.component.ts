import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import * as FileSaver from 'file-saver';
import { PDFDocument } from 'pdf-lib';
import { GstReportService } from './gst-report.service';

interface ExportColumn {
  title: string;
  dataKey: string;
  children?: ExportColumn[];
}

@Component({
  selector: 'app-gst-report',
  templateUrl: './gst-report.component.html',
  styleUrls: ['./gst-report.component.scss'],
})
export class GstReportComponent implements OnInit {
  excelData?: any;

  selectedCity: any;
  items: any[];
  gstReports: string[];
  selectedReport: string;
  worksheetGst3B: any;
  invoiceData: any[] = [
    {
      SNo: 1,
      Desc: 'DHARAMRAJ',
      GSTIN: '',
      InvoiceDate: '01-Jun-22',
      InvoiceNo: 'A006413',
      InvoiceValue: 10.0,
      LocalCentral: 'Local',
      InvoiceType: 'Inventory',
      HSNCode: 1904101,
      Quantity: 1,
      Amount: 9.8,
      TaxableAmount: 8.3,
      SGST: {
        Percentage: 9.0,
        Amount: 0.75,
      },
      CGST: {
        Percentage: 9.0,
        Amount: 0.75,
      },
      IGST: {
        Percentage: 0.0,
        Amount: 0.0,
      },
      Cess: 0.0,
      TotalGST: 1.5,
    },
    {
      SNo: 2,
      Desc: 'ABC',
      GSTIN: '',
      InvoiceDate: '01-Jun-22',
      InvoiceNo: 'A006413',
      InvoiceValue: 10.0,
      LocalCentral: 'Local',
      InvoiceType: 'Inventory',
      HSNCode: 1904101,
      Quantity: 1,
      Amount: 9.8,
      TaxableAmount: 8.3,
      SGST: {
        Percentage: 9.0,
        Amount: 0.75,
      },
      CGST: {
        Percentage: 9.0,
        Amount: 0.75,
      },
      IGST: {
        Percentage: 0.0,
        Amount: 0.0,
      },
      Cess: 0.0,
      TotalGST: 1.5,
    },
    {
      SNo: 3,
      Desc: 'XYZ',
      GSTIN: '',
      InvoiceDate: '01-Jun-22',
      InvoiceNo: 'A006413',
      InvoiceValue: 10.0,
      LocalCentral: 'Local',
      InvoiceType: 'Inventory',
      HSNCode: 1904101,
      Quantity: 1,
      Amount: 9.8,
      TaxableAmount: 8.3,
      SGST: {
        Percentage: 9.0,
        Amount: 0.75,
      },
      CGST: {
        Percentage: 9.0,
        Amount: 0.75,
      },
      IGST: {
        Percentage: 0.0,
        Amount: 0.0,
      },
      Cess: 0.0,
      TotalGST: 1.5,
    },
    {
      SNo: 4,
      Desc: 'DHARAMRAJ',
      GSTIN: '',
      InvoiceDate: '01-Jun-22',
      InvoiceNo: 'A006413',
      InvoiceValue: 10.0,
      LocalCentral: 'Local',
      InvoiceType: 'Inventory',
      HSNCode: 1904101,
      Quantity: 1,
      Amount: 9.8,
      TaxableAmount: 8.3,
      SGST: {
        Percentage: 9.0,
        Amount: 0.75,
      },
      CGST: {
        Percentage: 9.0,
        Amount: 0.75,
      },
      IGST: {
        Percentage: 0.0,
        Amount: 0.0,
      },
      Cess: 0.0,
      TotalGST: 1.5,
    },
    {
      SNo: 5,
      Desc: 'ABC',
      GSTIN: '',
      InvoiceDate: '01-Jun-22',
      InvoiceNo: 'A006413',
      InvoiceValue: 10.0,
      LocalCentral: 'Local',
      InvoiceType: 'Inventory',
      HSNCode: 1904101,
      Quantity: 1,
      Amount: 9.8,
      TaxableAmount: 8.3,
      SGST: {
        Percentage: 9.0,
        Amount: 0.75,
      },
      CGST: {
        Percentage: 9.0,
        Amount: 0.75,
      },
      IGST: {
        Percentage: 0.0,
        Amount: 0.0,
      },
      Cess: 0.0,
      TotalGST: 1.5,
    },
    {
      SNo: 6,
      Desc: 'XYZ',
      GSTIN: '',
      InvoiceDate: '01-Jun-22',
      InvoiceNo: 'A006413',
      InvoiceValue: 10.0,
      LocalCentral: 'Local',
      InvoiceType: 'Inventory',
      HSNCode: 1904101,
      Quantity: 1,
      Amount: 9.8,
      TaxableAmount: 8.3,
      SGST: {
        Percentage: 9.0,
        Amount: 0.75,
      },
      CGST: {
        Percentage: 9.0,
        Amount: 0.75,
      },
      IGST: {
        Percentage: 0.0,
        Amount: 0.0,
      },
      Cess: 0.0,
      TotalGST: 1.5,
    },
    {
      SNo: 7,
      Desc: 'DHARAMRAJ',
      GSTIN: '',
      InvoiceDate: '01-Jun-22',
      InvoiceNo: 'A006413',
      InvoiceValue: 10.0,
      LocalCentral: 'Local',
      InvoiceType: 'Inventory',
      HSNCode: 1904101,
      Quantity: 1,
      Amount: 9.8,
      TaxableAmount: 8.3,
      SGST: {
        Percentage: 9.0,
        Amount: 0.75,
      },
      CGST: {
        Percentage: 9.0,
        Amount: 0.75,
      },
      IGST: {
        Percentage: 0.0,
        Amount: 0.0,
      },
      Cess: 0.0,
      TotalGST: 1.5,
    },
    {
      SNo: 8,
      Desc: 'ABC',
      GSTIN: '',
      InvoiceDate: '01-Jun-22',
      InvoiceNo: 'A006413',
      InvoiceValue: 10.0,
      LocalCentral: 'Local',
      InvoiceType: 'Inventory',
      HSNCode: 1904101,
      Quantity: 1,
      Amount: 9.8,
      TaxableAmount: 8.3,
      SGST: {
        Percentage: 9.0,
        Amount: 0.75,
      },
      CGST: {
        Percentage: 9.0,
        Amount: 0.75,
      },
      IGST: {
        Percentage: 0.0,
        Amount: 0.0,
      },
      Cess: 0.0,
      TotalGST: 1.5,
    },
    {
      SNo: 9,
      Desc: 'XYZ',
      GSTIN: '',
      InvoiceDate: '01-Jun-22',
      InvoiceNo: 'A006413',
      InvoiceValue: 10.0,
      LocalCentral: 'Local',
      InvoiceType: 'Inventory',
      HSNCode: 1904101,
      Quantity: 1,
      Amount: 9.8,
      TaxableAmount: 8.3,
      SGST: {
        Percentage: 9.0,
        Amount: 0.75,
      },
      CGST: {
        Percentage: 9.0,
        Amount: 0.75,
      },
      IGST: {
        Percentage: 0.0,
        Amount: 0.0,
      },
      Cess: 0.0,
      TotalGST: 1.5,
    },
  ];
  invoiceSummary: any[] = [
    {
      Description: 'B2B',
      Count: 0,
      Taxable: 0.0,
      SGST: 0.0,
      CGST: 0.0,
      IGST: 0.0,
      Cess: 0.0,
      'Total GST': 0.0,
      'Invoice Amount': 0.0,
    },
    {
      Description: 'B2C (Large) Invoice',
      Count: 0,
      Taxable: 0.0,
      SGST: 0.0,
      CGST: 0.0,
      IGST: 0.0,
      Cess: 0.0,
      'Total GST': 0.0,
      'Invoice Amount': 0.0,
    },
    {
      Description: 'B2C (Small) Invoice',
      Count: 3162,
      Taxable: 852460.6,
      SGST: 45338.94,
      CGST: 45338.94,
      IGST: 0.0,
      Cess: 0.0,
      'Total GST': 90677.88,
      'Invoice Amount': 943290.62,
    },
    {
      Description: 'Nil rated',
      Count: 152,
      Taxable: 8065.02,
      SGST: 0.0,
      CGST: 0.0,
      IGST: 0.0,
      Cess: 0.0,
      'Total GST': 0.0,
      'Invoice Amount': 8072.69,
    },
    {
      Description: '- Nil rated',
      Count: 152,
      Taxable: 8065.02,
      SGST: 0.0,
      CGST: 0.0,
      IGST: 0.0,
      Cess: 0.0,
      'Total GST': 0.0,
      'Invoice Amount': 8072.69,
    },
    {
      Description: '- Exempted',
      Count: 0,
      Taxable: 0.0,
      SGST: 0.0,
      CGST: 0.0,
      IGST: 0.0,
      Cess: 0.0,
      'Total GST': 0.0,
      'Invoice Amount': 0.0,
    },
    {
      Description: 'Total',
      Count: 3314,
      Taxable: 860525.62,
      SGST: 45338.94,
      CGST: 45338.94,
      IGST: 0.0,
      Cess: 0.0,
      'Total GST': 90677.88,
      'Invoice Amount': 951363.31,
    },
  ];
  exportColumns: ExportColumn[] = [
    { title: 'SNo', dataKey: 'SNo' },
    { title: 'Desc', dataKey: 'Desc' },
    { title: 'GSTIN', dataKey: 'GSTIN' },
    { title: 'InvoiceDate', dataKey: 'InvoiceDate' },
    { title: 'InvoiceNo', dataKey: 'InvoiceNo' },
    { title: 'InvoiceValue', dataKey: 'InvoiceValue' },
    { title: 'LocalCentral', dataKey: 'LocalCentral' },
    { title: 'InvoiceType', dataKey: 'InvoiceType' },
    { title: 'HSNCode', dataKey: 'HSNCode' },
    { title: 'Quantity', dataKey: 'Quantity' },
    { title: 'Amount', dataKey: 'Amount' },
    { title: 'TaxableAmount', dataKey: 'TaxableAmount' },
    {
      title: 'SGST',
      dataKey: 'SGST',
      children: [
        { title: 'Percentage', dataKey: 'SGST.Percentage' },
        { title: 'Amount', dataKey: 'SGST.Amount' },
      ],
    },
    {
      title: 'CGST',
      dataKey: 'CGST',
      children: [
        { title: 'Percentage', dataKey: 'CGST.Percentage' },
        { title: 'Amount', dataKey: 'CGST.Amount' },
      ],
    },
    {
      title: 'IGST',
      dataKey: 'IGST',
      children: [
        { title: 'Percentage', dataKey: 'IGST.Percentage' },
        { title: 'Amount', dataKey: 'IGST.Amount' },
      ],
    },
    { title: 'Cess', dataKey: 'Cess' },
    { title: 'TotalGST', dataKey: 'TotalGST' },
  ];
  cellData: any;

  invoiceData1 = [
    {
      desc: 'Cash Sales and Purchase',
      gstin: '464864534534',
      invoice_date: '2023-11-02 15:05:21',
      invoice_value: 74,
      localCentral: 'local',
      invoice_type: 'inventory',
      item: [
        {
          idorder_detail: 28,
          idcustomer_order: 18,
          idproduct_master: 10469,
          idinventory: 20947,
          quantity: 1,
          total_price: 74,
          total_sgst: 5.64,
          discount: 26,
          total_cgst: 5.64,
          unit_mrp: 100,
          unit_selling_price: 74,
          part_of_pkg: 0,
          idpackage: 0,
          pkg_amount: 0,
          remark: '',
          created_at: '2023-11-02 14:33:05',
          updated_at: '2023-11-02 14:33:05',
          created_by: null,
          updated_by: null,
          status: 1,
          idcategory: 1,
          idsub_category: 47,
          idsub_sub_category: 38,
          idbrand: 25,
          name: 'Occasions',
          description: 'Assorted Fusion',
          barcode: '8901719126642',
          image: null,
          hsn: null,
          cgst: 9,
          sgst: 9,
          igst: null,
          cess: 0,
        },
      ],
    },
  ];

  constructor(
    private gstReportService: GstReportService,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {
    this.gstReports = ['GST 1RDetailed', 'GST 1RSummary', 'GST 3B'];
    this.exportGSTR3B();
    this.cellData = [
      {
        Description: 'Export Invoices Test',
        Count: 0,
        Taxable: 980456.0,
        SGST: 0.0,
        CGST: 0.0,
        IGST: 0.0,
        Cess: 0.0,
        TotalGST: 0.0,
        InvoiceAmount: 0.0,
      },
      {
        Description: 'Export Invoices Test 2',
        Count: 0,
        Taxable: 980456.0,
        SGST: 0.0,
        CGST: 0.0,
        IGST: 0.0,
        Cess: 0.0,
        TotalGST: 0.0,
        InvoiceAmount: 0.0,
      },
    ];
  }

  generateGSTSummary() {
    const filePath = 'assets/excel/GSTR1SUMMARY.xlsx';
    const sheetName = 'SUMMARY';

    this.httpClient.get(filePath, { responseType: 'arraybuffer' }).subscribe(
      (data: ArrayBuffer) => {
        const file = new File([data], 'GST3b.xls', {
          type: 'application/vnd.ms-excel',
        });

        this.gstReportService
          .generateGSTSummary(file, sheetName, this.cellData)
          .then(() => {
            console.log('Excel updated successfully');
          })
          .catch((error) => {
            console.error('Error updating Excel:', error);
          });
      },
      (error) => {
        console.error('Error loading Excel file:', error);
      }
    );
  }

  generateGST3B() {
    const filePath = 'assets/excel/GSTR3B.xlsx';
    const sheetName = 'GSTR3B';

    this.httpClient.get(filePath, { responseType: 'arraybuffer' }).subscribe(
      (data: ArrayBuffer) => {
        const file = new File([data], 'GST3b.xls', {
          type: 'application/vnd.ms-excel',
        });

        this.gstReportService
          .generateGSTSummary(file, sheetName, this.cellData)
          .then(() => {
            console.log('Excel updated successfully');
          })
          .catch((error) => {
            console.error('Error updating Excel:', error);
          });
      },
      (error) => {
        console.error('Error loading Excel file:', error);
      }
    );
  }

  exportExcel() {
    const workbook = new ExcelJS.Workbook();
    let worksheet3B = workbook.addWorksheet('Form GSTR-3B');
    // Add GSTIN, Year, and Month
    worksheet3B.addRow(['1. GSTIN:', 'Year', 2022]);
    worksheet3B.addRow(['', 'Month', 6]);
    // Add Legal name of the registered person
    // worksheet3B.addRow(['Legal name of the registered person:', 'GHAR GHAR BAZAAR']);
    // Add table headers
    worksheet3B.addRow([
      'Nature of Supplies',
      'Total Taxable Value',
      'Integrated Tax',
      'Central Tax',
      'State/UT Tax',
      'Cess',
    ]);
    // Add data to the worksheet3B
    worksheet3B.addRow([
      '(a) Outward taxable supplies (other than zero rated, nil rated and exempted)',
      787614.2,
      0.0,
      45338.94,
      45338.94,
      0.0,
    ]);
    worksheet3B.addRow([
      '(b) Outward taxable supplies (zero rated)',
      0.0,
      0,
      0,
      0,
      0,
    ]);
    worksheet3B.addRow([
      '(c) Other outward supplies, (Nil rated, exempted)',
      72911.42,
    ]);
    worksheet3B.addRow([
      '(d) Inward supplies (liable to reverse charge)',
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
    ]);

    // Add empty row
    worksheet3B.addRow([]);

    // Add table headers for 3.2
    worksheet3B.addRow([
      'Place of Supply (State/UT)',
      'Total Taxable Value',
      'Amount of Integrated Tax',
    ]);

    // Add data for 3.2
    worksheet3B.addRow(['1', 0.0, 0.0]);

    // Add empty row
    worksheet3B.addRow([]);

    // Add table headers for 4
    worksheet3B.addRow([
      'Details',
      'Integrated Tax',
      'Central Tax',
      'State/UT Tax',
      'Cess',
    ]);

    // Add data for 4
    worksheet3B.addRow([
      '(A) ITC available (whether in full or part)',
      0.0,
      0.0,
      0.0,
      0.0,
    ]);
    worksheet3B.addRow(['(B) ITC reversed', 0.0, 0.0, 0.0, 0.0]);
    worksheet3B.addRow([
      '(C) Net ITC Available (A)-(B)',
      0.0,
      11801.45,
      11801.45,
      0.0,
    ]);

    // Add empty row
    worksheet3B.addRow([]);

    // Add table headers for 5
    worksheet3B.addRow([
      'Nature of Supplies',
      'Inter-state supplies',
      'Intra-State supplies',
    ]);

    // Add data for 5
    worksheet3B.addRow([
      'From a supplier under composition scheme, exempt and nil rated supply',
      0.0,
      132154.09,
    ]);
    worksheet3B.addRow(['Non GST Supply']);

    // Add empty row
    worksheet3B.addRow([]);

    // Add table headers for 6.1
    worksheet3B.addRow([
      'Description',
      'Tax payable',
      'Paid through ITC',
      '',
      'Tax paid TDS/TCS',
      'Tax/cess paid in cash',
      'Interest',
      'Late fee',
    ]);
    worksheet3B.addRow([
      '',
      'Integrated Tax',
      'Central Tax',
      'State/UT Tax',
      'Cess',
    ]);

    // Add data for 6.1
    worksheet3B.addRow(['Integrated Tax', 0.0, 0.0]);
    worksheet3B.addRow(['Central Tax', 45338.94, 11801.45]);
    worksheet3B.addRow(['State/UT Tax', 45338.94, 0.0, 11801.45]);
    worksheet3B.addRow(['Cess', 0.0, 0.0]);

    // Add empty row
    worksheet3B.addRow([]);

    // Add table headers for 6.2
    worksheet3B.addRow([
      'Details',
      'Integrated Tax',
      'Central Tax',
      'State/UT Tax',
    ]);
    worksheet3B.addRow(['TDS']);
    worksheet3B.addRow(['TCS']);

    // Add empty row
    worksheet3B.addRow([]);

    // Add Verification section
    worksheet3B.addRow(['Verification (by Authorised signatory)']);
    worksheet3B.addRow([]);
    worksheet3B.addRow([
      'I hereby solemnly affirm and declare that the information given herein above is true and',
    ]);
    worksheet3B.addRow([
      'correct to the best of my knowledge and belief and nothing has been concealed therefrom.',
    ]);
    worksheet3B.addRow([]);

    // Add Instructions section
    worksheet3B.addRow(['Instructions :']);
    worksheet3B.addRow([
      '1) Value of Taxable Supplies = Value of invoices + value of Debit Notes - value of credit notes',
    ]);
    worksheet3B.addRow([
      '+ value of advances received for which invoices have not been issued in the same',
    ]);
    worksheet3B.addRow(['month - value of advances adjusted against invoices']);
    worksheet3B.addRow([]);
    worksheet3B.addRow([
      '2) Details of advances as well as adjustment of same against invoices to be adjusted and not shown separately',
    ]);
    worksheet3B.addRow([]);
    worksheet3B.addRow([
      '3) Amendment in any details to be adjusted and not shown separately.',
    ]);

    // Set column widths
    worksheet3B.getColumn(1).width = 40;
    worksheet3B.getColumn(2).width = 20;
    worksheet3B.getColumn(3).width = 20;
    worksheet3B.getColumn(4).width = 20;
    worksheet3B.getColumn(5).width = 20;
    worksheet3B.getColumn(6).width = 20;

    // const worksheet = xlsx.utils.json_to_sheet(this.tableData);
    // const workbook = { Sheets: { data: worksheet3B }, SheetNames: ['Form GSTR-3B'] };
    // const excelBuffer: any = xlsx.write(workbook, {
    //   bookType: 'xlsx',
    //   type: 'array',
    // });
    // this.saveAsExcelFile(excelBuffer, `${this.selectedReport}_report`);
    // });

    workbook.xlsx.writeBuffer().then((buffer: any) => {
      // Create a Blob from the buffer
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      // Trigger the download using FileSaver.js
      saveAs(blob, 'Form_GSTR-3B.xlsx');
    });
  }

  exportGst3B() {
    this.exportExcel();
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  async exportGSTR3B() {
    const workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet('Form GSTR-3B');
    worksheet.addRow(['See Rule 61(5)']);

    worksheet.addRow(['Form GSTR-3B']);

    worksheet.addRow([
      'Legal name of the registered person:',
      'GHAR GHAR BAZAAR',
    ]);

    // Add table headers
    worksheet.addRow([
      'Nature of Supplies',
      'Total Taxable Value',
      'Integrated Tax',
      'Central Tax',
      'State/UT Tax',
      'Cess',
    ]);

    // Add data to the worksheet
    worksheet.addRow([
      '(a) Outward taxable supplies (other than zero rated, nil rated and exempted)',
      787614.2,
      0.0,
      45338.94,
      45338.94,
      0.0,
    ]);
    worksheet.addRow([
      '(b) Outward taxable supplies (zero rated)',
      0.0,
      0,
      0,
      0,
      0,
    ]);
    worksheet.addRow([
      '(c) Other outward supplies, (Nil rated, exempted)',
      72911.42,
    ]);
    worksheet.addRow([
      '(d) Inward supplies (liable to reverse charge)',
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
    ]);

    // Add empty row
    worksheet.addRow([]);

    // Add table headers for 3.2
    worksheet.addRow([
      'Place of Supply (State/UT)',
      'Total Taxable Value',
      'Amount of Integrated Tax',
    ]);

    // Add data for 3.2
    worksheet.addRow(['1', 0.0, 0.0]);

    // Add empty row
    worksheet.addRow([]);

    // Add table headers for 4
    worksheet.addRow([
      'Details',
      'Integrated Tax',
      'Central Tax',
      'State/UT Tax',
      'Cess',
    ]);

    // Add data for 4
    worksheet.addRow([
      '(A) ITC available (whether in full or part)',
      0.0,
      0.0,
      0.0,
      0.0,
    ]);
    worksheet.addRow(['(B) ITC reversed', 0.0, 0.0, 0.0, 0.0]);
    worksheet.addRow([
      '(C) Net ITC Available (A)-(B)',
      0.0,
      11801.45,
      11801.45,
      0.0,
    ]);

    // Add empty row
    worksheet.addRow([]);

    // Add table headers for 5
    worksheet.addRow([
      'Nature of Supplies',
      'Inter-state supplies',
      'Intra-State supplies',
    ]);

    // Add data for 5
    worksheet.addRow([
      'From a supplier under composition scheme, exempt and nil rated supply',
      0.0,
      132154.09,
    ]);
    worksheet.addRow(['Non GST Supply']);

    // Add empty row
    worksheet.addRow([]);

    // Add table headers for 6.1
    worksheet.addRow([
      'Description',
      'Tax payable',
      'Paid through ITC',
      '',
      'Tax paid TDS/TCS',
      'Tax/cess paid in cash',
      'Interest',
      'Late fee',
    ]);
    worksheet.addRow([
      '',
      'Integrated Tax',
      'Central Tax',
      'State/UT Tax',
      'Cess',
    ]);

    // Add data for 6.1
    worksheet.addRow(['Integrated Tax', 0.0, 0.0]);
    worksheet.addRow(['Central Tax', 45338.94, 11801.45]);
    worksheet.addRow(['State/UT Tax', 45338.94, 0.0, 11801.45]);
    worksheet.addRow(['Cess', 0.0, 0.0]);

    // Add empty row
    worksheet.addRow([]);

    // Add table headers for 6.2
    worksheet.addRow([
      'Details',
      'Integrated Tax',
      'Central Tax',
      'State/UT Tax',
    ]);
    worksheet.addRow(['TDS']);
    worksheet.addRow(['TCS']);

    // Add empty row
    worksheet.addRow([]);

    // Add Verification section
    worksheet.addRow(['Verification (by Authorised signatory)']);
    worksheet.addRow([]);
    worksheet.addRow([
      'I hereby solemnly affirm and declare that the information given herein above is true and',
    ]);
    worksheet.addRow([
      'correct to the best of my knowledge and belief and nothing has been concealed therefrom.',
    ]);
    worksheet.addRow([]);

    // Add Instructions section
    worksheet.addRow(['Instructions :']);
    worksheet.addRow([
      '1) Value of Taxable Supplies = Value of invoices + value of Debit Notes - value of credit notes',
    ]);
    worksheet.addRow([
      '+ value of advances received for which invoices have not been issued in the same',
    ]);
    worksheet.addRow(['month - value of advances adjusted against invoices']);
    worksheet.addRow([]);
    worksheet.addRow([
      '2) Details of advances as well as adjustment of same against invoices to be adjusted and not shown separately',
    ]);
    worksheet.addRow([]);
    worksheet.addRow([
      '3) Amendment in any details to be adjusted and not shown separately.',
    ]);

    // Set column widths
    worksheet.getColumn(1).width = 40;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(6).width = 20;

    // Convert the workbook to Base64
    workbook.xlsx.writeBuffer().then((buffer: any) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      // saveAs(blob, `test.xlsx`);
      const jsonData: any[] = worksheet.getSheetValues();
      this.excelData = jsonData.slice(1); // Exclude headers
    });
  }

  // exportPdf() {
  //   import('jspdf').then((jsPDF) => {
  //     import('jspdf-autotable').then((x) => {
  //       const doc = new jsPDF.default('p', 'px', 'a4');
  //       (doc as any).autoTable(
  //         this.exportColumns,
  //         this.selectedRecords == undefined
  //           ? this.tableData
  //           : this.selectedRecords
  //       );
  //       doc.save(`GST3B_report`);
  //     });
  //   });
  // }

  exportPdfGeneric() {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
        const doc = new jsPDF.default('p', 'px', 'a4');
        const columns = this.getColumns(this.exportColumns);
        const data = [this.flattenData(this.invoiceData)]; // Wrap the flattened data in an array
        (doc as any).autoTable({
          columns: columns,
          body: data,
        });
        doc.save('products.pdf');
      });
    });
  }

  flattenData(data: any): any {
    const result: any = {};
    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'object' && data[key] !== null) {
        const flattenedData = this.flattenData(data[key]);
        Object.keys(flattenedData).forEach((nestedKey) => {
          result[`${key}.${nestedKey}`] = flattenedData[nestedKey];
        });
      } else {
        result[key] = data[key];
      }
    });
    return result;
  }

  getColumns(columns: any[]): any[] {
    const result: any[] = [];
    columns.forEach((col) => {
      if (col.children) {
        // If the column has children, it's a nested header
        const nestedHeader: any = { title: col.header, dataKey: col.field };
        nestedHeader['columns'] = this.getColumns(col.children); // Recursively get columns for nested headers
        result.push(nestedHeader);
      } else {
        // If the column doesn't have children, it's a regular column
        result.push({ title: col.header, dataKey: col.field });
      }
    });
    return result;
  }

  exportExcelGeneric() {
    import('xlsx').then((xlsx) => {
      const worksheet1 = xlsx.utils.json_to_sheet(this.invoiceData1);
      const workbook1 = { Sheets: { data: worksheet1 }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook1, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'products');

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('test');
      workbook.xlsx.load(excelBuffer).then(async () => {
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();

        // Add a blank page to the PDF document
        const page = pdfDoc.addPage();

        // Get the first sheet from the Excel workbook
        const sheet1 = workbook.addWorksheet['test'];

        // Define the font size for the PDF
        const fontSize = 12;

        // Iterate through the rows in the Excel sheet
        sheet.eachRow((row, rowNum) => {
          // Iterate through the cells in each row
          row.eachCell((cell, colNum) => {
            // Get the cell value
            const cellValue = cell.value;

            // Add the cell value to the PDF page
            page.drawText(`${cellValue}`, {
              x: colNum * 100,
              y: 700 - rowNum * fontSize,
            });
          });
        });

        // Save the PDF buffer
        const pdfBytes = await pdfDoc.save();

        // Now, you can use pdfBytes as needed, e.g., save it to a file or send it as a response

        // Example: Save PDF to a file
        // const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'output.pdf';
        link.click();
      });
    });
  }

  saveAsExcelFileGeneric(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
}
