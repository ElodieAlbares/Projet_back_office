import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ProductsService } from '../../core/service/products.service';

@Component({
  selector: 'app-products',
  standalone:true,
  imports: [MatTableModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  displayedColumns: string[] = ['name', 'price','unit'];
  products: any[] = [];
  constructor(private productService:ProductsService){}
  ngOnInit() {
    this.productService.getProducts().subscribe((data)=>{
      console.log("data",data)
      this.products = data
    },
    (error)=>{
    console.log(error)
    });
    }
  
}