import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [FormsModule, MatDialogModule, MatLabel, MatFormFieldModule, MatInputModule, MatCheckboxModule, CommonModule],
  templateUrl: './product-popup.component.html',
  styleUrl: './product-popup.component.scss'
})
export class ProductPopupComponent {
  //Sauvegarder les données de base pour permettre comparaison
  originalData: Product[] = [];

  //Gérer sattus de la checkox poru chaque produits
  checkboxState: { [productId: number]: boolean } = {};

  //variables pour gérér transactions
  newQuantity: any;
  balance: any;

  constructor(
    public dialogRef: MatDialogRef<ProductPopupComponent>,
    private productService:ProductsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.originalData={...data};
    console.log(this.originalData);
    this.data.forEach((product: Product) => {
      if (this.checkboxState[product.id] === undefined) {
        this.checkboxState[product.id] = false; //Faux de base
      }
    });
  }
  // Gére la checkbox
  onCheckboxChange(event: any, product: Product): void {
    this.checkboxState[product.id] = event.checked;  // Update the checkbox state for the product
    console.log('Checkbox changed for product', product.id, 'Checked:', event.checked);
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
      const originalProduct = Object.values(this.originalData).find(p => p.id === product.id);;
      if (!originalProduct) {
        console.warn(`Original data not found for product with id: ${product.id}`);
        return;
      }
      //Récupérer le status de la checkbox
      const isChecked = this.checkboxState[product.id];

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
        if(originalProduct.quantity > product.quantity && !isChecked){
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
        if(originalProduct.quantity < product.quantity && !isChecked){
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
        if(originalProduct.quantity>product.quantity && isChecked){
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
