import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = 'http://127.0.0.1:8000/products/';

  constructor(public http:HttpClient) { }

  getProducts(){
    return this.http.get<any[]>(this.apiUrl);
  }
}
