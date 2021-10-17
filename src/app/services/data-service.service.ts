import { Injectable } from '@angular/core';
import{HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {GlobalDataSummary} from "../modals/global-data";
import {DateWiseData} from "../modals/date-wise-data";
import {main} from "@angular/compiler-cli/src/main";

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
private globalDataUrl='https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-04-2020.csv'
  private dateWiseUrl= 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'
  constructor(private http : HttpClient) { }

getDateWiseData(){
  return this.http.get(this.dateWiseUrl,{responseType:'text'})
    .pipe(map(result=>{
      let rows= result.split('\n');
      let mainData= {};
      let header= rows[0];
      let dates= header.split(/,(?=\S)/)
      dates.splice(0,4);
      rows.splice(0,1);
      rows.forEach(row=>{
        let cols= row.split(/,(?=\S)/)
        let con=cols[1];
        cols.splice(0,4);
        // @ts-ignore
        mainData[con]=[];
        cols.forEach((value,index) =>{
          let dw: DateWiseData ={
            cases: +value,
            country: con,
            date: new Date(Date.parse(dates[index]))
          }
          // @ts-ignore
          mainData[con].push(dw)
        })
      })

      return mainData;
    }))
}
  getGlobalData(){
 return this.http.get(this.globalDataUrl,{responseType:"text"}).pipe(
   map(result=>{
     let data : GlobalDataSummary [] = [];
     let raw:any ={}
    let rows= result.split('\n');
rows.splice(0,1);
    rows.forEach(row=>{
      let cols= row.split(/,(?=\S)/)

      let cs:any = {
        country : cols[3],
        confirmed : +cols[7],
        deaths : +cols [8],
        recovered : +cols[9],
        active : +cols[10],
      };
      let temp : GlobalDataSummary = raw[cs.country];
      if (temp){
        temp.active = cs.active + temp.active
        temp.confirmed = cs.confirmed + temp.confirmed
        temp.deaths = cs.deaths + temp.deaths
        temp.recovered = cs.recovered + temp.recovered

        raw[cs.country] =temp;
      } else{
        raw[cs.country] =cs
      }
    })
return<GlobalDataSummary[]>Object.values(raw);
   })
 )
  }
}
