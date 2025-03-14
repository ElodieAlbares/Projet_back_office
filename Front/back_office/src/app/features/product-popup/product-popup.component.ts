import { Component, Inject } from '@angular/core';
//Composant Material
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatLabel } from '@angular/material/form-field';
//composant de l'application (models/services...)
import { Transaction } from '../../core/models/transaction.model';
import { Historique } from '../../core/models/historique.model';
import { Product } from '../../core/models/product.model';
import { ProductsService } from '../../core/service/products.service';

@Component({
  selector: 'app-product-popup',
  standalone:true,
  imports: [FormsModule, MatDialogModule, MatLabel, MatFormFieldModule, MatInputModule, MatCheckboxModule],
  templateUrl: './product-popup.component.html',
  styleUrl: './product-popup.component.scss'
})
export class ProductPopupComponent {
  originalData: Product[];
  isChecked: boolean = false;

  //variables pour gérér transactions
  newQuantity: any;
  balance: any;

  constructor(
    public dialogRef: MatDialogRef<ProductPopupComponent>,
    private productService:ProductsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.originalData={...data};
  }
  // Gére la checkbox
  onCheckboxChange(event: any): void {
    console.log('Checkbox changed:', event.checked);
    this.isChecked = event.checked;  // Update the component's state
  }

  // Ferme sans sauvegardé données
  onCancel(): void {
    this.dialogRef.close();
  };

  // Ferme et envoie données
  onSave(): void {
    const changes: Historique[] = [];
    const trades: Transaction[] = [];

    this.data.forEach((product:Product) => {
      //Fetch le produit original dans la table
      const originalProduct = this.originalData.find(p => p.id === product.id);
      if (!originalProduct) {
        console.warn(`Original data not found for product with id: ${product.id}`);
        return;
      }

      if(originalProduct.price!== product.price){
        changes.push({
          id: product.id,
          type: 'adjust',
          fieldName: 'price',
          value: product.price,
          oldValue: originalProduct.price,
          timeStamp: new Date().toISOString(),
        })}
      if(originalProduct.quantity !== product.quantity){
        if(originalProduct.quantity > product.quantity && this.isChecked==false){
          this.newQuantity= originalProduct.quantity - product.quantity;
          this.balance= originalProduct.price * this.newQuantity;
          trades.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: this.newQuantity,
            balance: this.balance,
            timeStamp: new Date().toISOString(),
          });
          }
        if(originalProduct.quantity < product.quantity && this.isChecked==false){
          this.newQuantity= product.quantity - originalProduct.quantity;
          this.balance= -(product.price * this.newQuantity);
          trades.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: this.newQuantity,
            balance: this.balance,
            timeStamp: new Date().toISOString(),
          });
            }
        if(originalProduct.quantity>product.quantity && this.isChecked==true){
          changes.push({
            id: product.id,
            type: 'pertes',
            fieldName: 'quantity',
            value: product.price,
            oldValue: originalProduct.price,
            timeStamp: new Date().toISOString(),
            })
          }
      }
    });
      this.productService.updateProduct(this.data).subscribe(updatedProducts => {
      // Normalement, une fois les modifications apportés au produits, on devrait pouvoir sauvegarder les données de l'hisotiruqe et de la transaction
      this.productService.saveHistorique(changes).subscribe(() => {
        console.log('Historique saved successfully!');
      });
      this.productService.saveTransaction(trades).subscribe(() => {
        console.log('Transactions saved successfully!');
      });
      }
    )
      this.dialogRef.close(this.data);
    }
  }
