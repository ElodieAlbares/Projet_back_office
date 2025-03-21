import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../interface/Transaction';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  private jsonUrl = 'assets/transaction.json';
  listeTransactions : Transaction[] = [];
  transactionDictionary: { [key: string]: number } = {};

  constructor(private http: HttpClient) {

   }

  getUrl(){
    return this.jsonUrl
  }

  initParameters(years: string[], products: string[], selectedYear :string){
    products.push("Tous les produits");
    years.push("Toutes années");
    this.listeTransactions.forEach(element => {
    const time = new Date(element.timeStamp)
    if (years.indexOf(time.getFullYear().toString()) == -1){
      years.push(time.getFullYear().toString());
    }  
    if (products.indexOf(element.name) == -1){
      products.push(element.name);
    }
    });
    selectedYear = years[0];
  }

  yearHistory(year: string, produit: string){
    this.transactionDictionary = {};
    this.listeTransactions.forEach(element => {
      const time = new Date(element.timeStamp)
      if (time.getFullYear().toString() == year){
        var trimestre = this.getTrimestre(time) + year;
        this.updateDictionnary(trimestre, produit, element);
      }
      
    });
    return this.transactionDictionary;
  }

  monthHistory(year: string, produit: string){
    this.transactionDictionary = {};
    this.listeTransactions.forEach(element =>{
      const dateComplete = new Date(element.timeStamp)
      if (dateComplete.getFullYear().toString() == year){
        var month = dateComplete.getMonth();
        var monthAffiche = month + 1 + "/" + year;
        this.updateDictionnary(monthAffiche, produit, element );
      }      
    })
    return this.transactionDictionary
  }

  weekHistory(year: string, produit: string){
    this.transactionDictionary = {};
    this.listeTransactions.forEach(element =>{
      const dateComplete = new Date(element.timeStamp)
      if (dateComplete.getFullYear().toString() == year){
        var week = this.getWeekNumber(dateComplete);
        this.updateDictionnary(week.toString(), produit, element);
      }      
    })
    return this.transactionDictionary
  }

  calculeChiffreAffaireAnnuel(produit: string){
    this.transactionDictionary = {};
    this.listeTransactions.forEach(element => {
      const dateComplete = new Date(element.timeStamp)
      var year = dateComplete.getFullYear().toString();
      this.updateDictionnary(year, produit, element);
    });
    return this.transactionDictionary;
  }

  updateDictionnary(date: string, produit: string, transaction: Transaction ){
    if (produit == "Tous les produits" || produit == transaction.name){
      if (date in this.transactionDictionary){
        this.transactionDictionary[date] += transaction.balance;
      }
      else{
        this.transactionDictionary[date] = transaction.balance;
      }
    }
  }

  getTrimestre(date: Date){
    var trimestre = "";
        switch ( Math.floor((date.getMonth() + 4) / 4) ) {
          case 1:
            trimestre = "Janvier - Avril " 
            break;
          case 2:
            trimestre= "Mai - Aout "
            break;
          case 3:
            trimestre = "Septembre - Décembre "
            break;
          default: 
            trimestre = ""
            break;
        }
        return trimestre;  
  }

  getWeekNumber(date: Date): number {

    const tempDate = new Date(date.valueOf());
    const dayNum = (date.getDay() + 6) % 7;
    tempDate.setDate(tempDate.getDate() - dayNum + 3);
    const firstThursday = tempDate.valueOf();
    tempDate.setMonth(0, 1);

    if (tempDate.getDay() !== 4) {
        tempDate.setMonth(0, 1 + ((4 - tempDate.getDay()) + 7) % 7);
    }

    return 1 + Math.ceil((firstThursday - tempDate.valueOf()) / 604800000); 
}
}
