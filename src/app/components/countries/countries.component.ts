import {Component, Input, OnInit} from '@angular/core';
import {DataServiceService} from "../../services/data-service.service";
import {GlobalDataSummary} from "../../modals/global-data";
import {DateWiseData} from "../../modals/date-wise-data";
import {GoogleChartInterface} from "ng2-google-charts";

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

data : GlobalDataSummary[] | undefined ;
countries: string [] =[];
totalConfirmed=0;
totalActive=0;
totalDeaths=0;
totalRecovered=0;
selectedCountryData : DateWiseData[] | undefined;
dateWiseData: any;
lineChart: GoogleChartInterface ={
  chartType: 'LineChart'
}
  constructor(private service: DataServiceService) { }

  ngOnInit(): void {


    this.service.getDateWiseData().subscribe(
    (result)=>{
     this.dateWiseData =result;
     //this.updateChart();
    }
    )

    this.service.getGlobalData().subscribe(result=>{
      this.data= result;
      this.data.forEach(cs=>{
        if (cs.country != null) {
          this.countries.push(cs.country)
        }
      })
    })
  }

  //updateChart(){
  //let dataTable=[];
  // dataTable.push(["Date" ,"Cases"])
  //   this.selectedCountryData?.forEach(cs=>{
  //     dataTable.push([cs.date,cs.cases])
  //   })
  //   this.lineChart={
  //   chartType: 'LineChart',
  //     dataTable: dataTable,
  //     options:{
  //     height: 500
  //     },
  //   };
  // }

  updateValues(country:string){
    console.log(country);
    this.data?.forEach(cs=>{
      if(cs.country== country){
        this.totalActive= cs.active
        this.totalDeaths= cs.deaths
        this.totalRecovered= cs.recovered
        this.totalConfirmed=cs.confirmed
      }
    })

    this.selectedCountryData=this.dateWiseData[country]
//this.updateChart();
  }

}
