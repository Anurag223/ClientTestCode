import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable()
export class XLSXExportService {
    constructor() { }
    public exportAsExcelFile(json: any[], excelFileName: string): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }
    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }

    public convertExcelToJson(file: any) {
        var oFile =file;
        let reader = new FileReader();
        let workbook;
        let XL_row_object;
        let json_object;
        reader.readAsBinaryString(oFile);
        return new Promise((resolve,reject) => {
            reader.onload = function () {
                try{
                let data = reader.result;
                workbook = XLSX.read(data, { type: 'binary' });
                console.log(workbook);
                workbook.SheetNames.forEach(function (sheetName) {
                    XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                    json_object = JSON.stringify(XL_row_object);
                    console.log(json_object);
                    resolve(XL_row_object);               
                });
             }
                catch(ex){
                    reject(ex);
                }
            };
        });
    }
}