import { Component } from '@angular/core';
// Import de Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatFormField } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
//Import de notre app
import { ProductsService } from '../../core/service/products.service';
import { ProductPopupComponent } from '../../features/product-popup/product-popup.component';
import { Product } from '../../core/models/product.model';


@Component({
  selector: 'app-products',
  standalone:true,
  imports: [MatTableModule, MatFormField, MatDialogModule, MatButton],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  displayedColumns: string[] = ['name', 'price','unit', 'actions'];
  products: any[] = [];

  constructor(private productService:ProductsService, public dialog:MatDialog){}

  ngOnInit() {
    this.productService.getProducts().subscribe((data)=>{
      console.log("data",data)
      this.products = data
    },
    (error)=>{
      console.log(error)
      });
    }

    openEditDialog(product: Product): void {
      const dialogRef = this.dialog.open(ProductPopupComponent, {
        data: { ...product } // Pass a copy of the stock to prevent mutating the original directly
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log('Product updated:', result);
          // Handle the updated product result (e.g., update the products list)
        }
      });
    }
}