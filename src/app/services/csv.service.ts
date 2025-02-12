import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Papa from 'papaparse';

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  constructor(private http: HttpClient) { }

  parseCSV(fileName: string): Promise<any[]> {
    // TODO: Add a setting for the project base href to replace /relic-query/
    const baseURL = window.location.hostname === 'localhost' ? '/' : '/relic-query/'; // Dynamically set the base URL
    const filePath = `${baseURL}${fileName}`;
    return this.http.get(filePath, { responseType: 'text' }).toPromise().then((csvData:any) => {
      return new Promise((resolve, reject) => {
        Papa.parse(csvData, {
          header: true,
          complete: (result: any) => {
            resolve(result.data);
          },
          error: (error: any) => {
            reject(error);
          }
        });
      });
    });
  }

  getRecord(fileName: string, recordId: string): Promise<any> {
    return this.parseCSV(fileName).then((data: any[]) => {
      return data.find((record) => record.id === recordId);
    });
  }
}