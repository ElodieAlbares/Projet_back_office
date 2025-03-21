import { Component } from '@angular/core';
import { StatisticService } from '../../core/service/statistic.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 
import { MatRadioModule } from '@angular/material/radio'; 
import { MatFormField, MatSelectModule } from '@angular/material/select'; 
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [NgxChartsModule, FormsModule, MatRadioModule, MatSelectModule, MatInputModule, MatFormField],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent {
  view: [number, number] = [700, 400];

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Periode choisie';
  showYAxisLabel = true;
  yAxisLabel = 'chiffre d\'affaire (euros)';

  isNotAccessible: boolean = true;
  dateSelectedOption: string = '';

  selectedAnnee: string = '';
  optionsAnnee : string[] = [];

  selectedProduit ='';
  optionsProduit: string[] = [];


  transactionDictionary: { [key: string]: number } = {

  };

  single: any[] = []

  benef: string = ''
  impot: string = ''

  constructor(private service: StatisticService, private http: HttpClient) {
      this.http.get<any>(service.getUrl()).subscribe(res => {
      console.log(res)
      this.service.listeTransactions = res;
      this.service.initParameters(this.optionsAnnee, this.optionsProduit, this.selectedAnnee);
      this.selectedProduit = this.optionsProduit[0];
      this.selectedAnnee = this.optionsAnnee[0];
      this.transactionDictionary = this.service.calculeChiffreAffaireAnnuel(this.optionsProduit[0]);
      this.bilanComptable();
      this.refreshGraphique();
    });
  }

  onYearChange(event: any) {
    if (this.selectedAnnee == this.optionsAnnee[0]){  
      this.transactionDictionary = this.service.calculeChiffreAffaireAnnuel(this.selectedProduit);
      this.isNotAccessible = true;
    }
    else{
      this.transactionDictionary = this.service.yearHistory(this.selectedAnnee, this.selectedProduit);
      this.isNotAccessible = false;
    }
    this.bilanComptable();
    this.refreshGraphique();
    this.dateSelectedOption = "";  
  }

  onProductChange(event: any) {
    if (this.selectedAnnee == this.optionsAnnee[0]){
      this.transactionDictionary = this.service.calculeChiffreAffaireAnnuel(this.selectedProduit);
    }
    else{
      this.transactionDictionary = this.service.yearHistory(this.selectedAnnee, this.selectedProduit);
    }
    this.bilanComptable();
    this.refreshGraphique();
  }

  onDateIntervalleChange(event: any) {
    switch(this.dateSelectedOption){
      case "Trimestre":
        this.transactionDictionary = this.service.yearHistory(this.selectedAnnee, this.selectedProduit);
        break;
      case "Mensuel":
        this.transactionDictionary = this.service.monthHistory(this.selectedAnnee, this.selectedProduit);
        break;
      case "Hebdomadaire":
        this.transactionDictionary = this.service.weekHistory(this.selectedAnnee, this.selectedProduit);
        break;
      default:
        break;
    }
    this.refreshGraphique();

  }

  bilanComptable(){
    var benefNumber = Object.values(this.transactionDictionary).reduce((acc, val) => acc + val, 0);
    var impotNumber  = benefNumber*0.3
    this.benef = benefNumber.toString() + " euros";
    this.impot = impotNumber.toString() + " euros";
  }

  refreshGraphique(){
    this.single = Object.keys(this.transactionDictionary).map(key => ({
      name: key,
      value: this.transactionDictionary[key]
    }));    
  }

}
