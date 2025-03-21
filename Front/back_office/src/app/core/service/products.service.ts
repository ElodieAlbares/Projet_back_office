import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Historique } from '../models/historique.model';
import { Transaction } from '../models/transaction.model';
import { Product } from '../models/product.model';

//Besoin de modiffier les puts une fis que base de données local créer!

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = 'http://127.0.0.1:8000/products/';
  private productURL = 'assets/product.json';

  constructor(public http:HttpClient) { }

  getProducts(){
    return this.http.get<any[]>(this.apiUrl);
  }

  // Enregistrer les produts modifiés
  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${product.id}`, product);
  }

  // Enregistrer l'historique
  saveHistorique(changes: Historique[]): Observable<Historique[]> {
    return this.http.post<Historique[]>(`${this.apiUrl}/historique`, changes);
  }

  // Enregistrer les transactions
  saveTransaction(trades: Transaction[]): Observable<Transaction[]> {
    return this.http.post<Transaction[]>(`${this.apiUrl}/transactions`, trades);
  }
}
