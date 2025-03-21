import { Component } from '@angular/core';
import { StatisticService } from '../../core/service/statistic.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio'; 
import { MatFormField, MatSelectModule } from '@angular/material/select'; 
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [NgxChartsModule, RouterModule, MatIcon, FormsModule, MatRadioModule, MatSelectModule, MatInputModule, MatFormField, MatCard, MatToolbarModule],
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
  yAxisLabel = 'Bénéfices dégagées en euros';

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
      this.xAxisLabel = "Résultats par année"
      this.bilanComptable();
      this.refreshGraphique();
    });
  }

  // Choix d'une année ou vision global si on choist l'option "toutes les années"
  onYearChange(event: any) {
    if (this.selectedAnnee == this.optionsAnnee[0]){  
      this.transactionDictionary = this.service.calculeChiffreAffaireAnnuel(this.selectedProduit);
      this.isNotAccessible = true;
      this.xAxisLabel = "Résultats par année"
    }
    else{
      this.transactionDictionary = this.service.yearHistory(this.selectedAnnee, this.selectedProduit);
      this.isNotAccessible = false;
      this.xAxisLabel = "Résultats par trimèstre"
    }
    this.bilanComptable();
    this.refreshGraphique();
    this.dateSelectedOption = "";  
  }

  // Choix d'un produit ou vision gloabl si on choisit l'option "tous les produits"
  onProductChange(event: any) {
    if (this.selectedAnnee == this.optionsAnnee[0]){
      this.transactionDictionary = this.service.calculeChiffreAffaireAnnuel(this.selectedProduit);
    }
    console.log(this.dateSelectedOption)
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
        this.transactionDictionary = this.service.yearHistory(this.selectedAnnee, this.selectedProduit);
        break;
    }
    this.bilanComptable();
    this.refreshGraphique();
  }

  // choix de l'intervalle sur lequel on affiche les résultats
  onDateIntervalleChange(event: any) {
    switch(this.dateSelectedOption){
      case "Trimestre":
        this.transactionDictionary = this.service.yearHistory(this.selectedAnnee, this.selectedProduit);
        this.xAxisLabel = "Résultats par trimèstre"
        break;
      case "Mensuel":
        this.transactionDictionary = this.service.monthHistory(this.selectedAnnee, this.selectedProduit);
        this.xAxisLabel = "Résultats par mois"
        break;
      case "Hebdomadaire":
        this.transactionDictionary = this.service.weekHistory(this.selectedAnnee, this.selectedProduit);
        this.xAxisLabel = "Résultats par semaine"
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
