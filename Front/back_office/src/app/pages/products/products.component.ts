import { Component} from '@angular/core';
// Import de Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatFormField } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
//Import de notre app
import { ProductsService } from '../../core/service/products.service';
import { ProductPopupComponent } from '../../features/product-popup/product-popup.component';
import { Product } from '../../core/models/product.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-products',
  standalone:true,
  imports: [MatTableModule, MatFormField, MatDialogModule, MatButton, MatCheckboxModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  displayedColumns: string[] = ['select','name', 'price','unit', 'quantity', 'actions'];
  products: any[] = [];
  fish: any[]=[];
  crustacean: any[]=[];
  seafood: any[]=[];
  selectedProducts: any[]=[];

  constructor(private productService:ProductsService, public dialog:MatDialog,private router: Router){}

  ngOnInit() {
    this.productService.getProducts().subscribe((data)=>{
      console.log("data",data);
      this.products = data;
      this.sortProducts();
      console.log('poisson:', this.fish)
    },
    (error)=>{
      console.log(error)
      });
    }
    navigateToHistory():void{
      this.router.navigate(['/history']);
    }
    sortProducts():void{
      // S'assure que array sont vides
      this.fish = [];
      this.crustacean = [];
      this.seafood = [];

      // Case switch pour trier par catégories
      this.products.forEach(product => {
        switch (product.category) {
          case 0:
            this.fish.push(product);
            break;
          case 1:
            this.seafood.push(product);
            break;
          case 2:
            this.crustacean.push(product);
            break;
          default:
            // If the categoryId doesn't match any of the above, you can handle it here
            break;
          }
        });
      };

    //Function pour séléction multiple
    //Check et uncheck box
    toggleSelection(product: any): void {
      const index = this.selectedProducts.indexOf(product);
      if (index === -1) {
        this.selectedProducts.push(product);
      } else {
        this.selectedProducts.splice(index, 1);
      }
    }

    toggleAll(event: any): void {
      if (event.checked) {
        this.selectedProducts = [...this.products];
      } else {
        this.selectedProducts = [];
      }
    }

    isAllSelected(): boolean {
      return this.selectedProducts.length === this.products.length;
    }

    isIndeterminate(): boolean {
      return this.selectedProducts.length > 0 && this.selectedProducts.length < this.products.length;
    }
  
    isSelected(product: any): boolean {
      return this.selectedProducts.indexOf(product) !== -1;
    }

    openEditDialog(product: Product): void {
      const index = this.selectedProducts.indexOf(product);
      if (index === -1) {
        this.selectedProducts.push(product);
      }
      const dialogRef = this.dialog.open(ProductPopupComponent, {
        data: this.selectedProducts // Pass a copy of the stock to prevent mutating the original directly
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log('Product updated:', result);
          // Handle the updated product result (e.g., update the products list)
        }
      });
    }

    //Ouvre le pop up pour édition de plusieurs produits
    openBulkEditDialog(): void {
      const dialogRef = this.dialog.open(ProductPopupComponent, {
        data: this.selectedProducts, // Pass selected products for bulk edit
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          console.log('Bulk products updated:', result);
          // Handle bulk update logic here
          this.selectedProducts.forEach((product) => {
            const updatedProduct = result.find((updated:any) => updated.id === product.id);
            if (updatedProduct) {
              Object.assign(product, updatedProduct);
            }
          });
        }
      });
    }
}