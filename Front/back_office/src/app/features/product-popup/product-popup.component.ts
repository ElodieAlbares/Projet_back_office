import { Component, Inject } from '@angular/core';
//Composant Material
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatLabel } from '@angular/material/form-field';
//composant de l'appolication (models/services...)
import { Transaction } from '../../core/models/transaction.model';
import { Historique } from '../../core/models/historique.model';
import { ProductsService } from '../../core/service/products.service';

@Component({
  selector: 'app-product-popup',
  standalone:true,
  imports: [FormsModule, MatDialogModule, MatLabel, MatFormFieldModule, MatInputModule, MatCheckboxModule],
  templateUrl: './product-popup.component.html',
  styleUrl: './product-popup.component.scss'
})
export class ProductPopupComponent {
  originalData: any;
  isChecked: boolean = false;

  //variables pour gérér transactions
  newQuantity: number;
  balance: number;

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

      if(this.originalData.price!==this.data.price){
        changes.push({
          id: this.data.id,
          type: 'adjust',
          fieldName: 'price',
          value: this.data.price,
          oldValue: this.originalData.price,
          timeStamp: new Date().toISOString(),
        })}
      if(this.originalData.quantity !== this.data.quantity){
        if(this.originalData.quantity > this.data.quantity && this.isChecked==false){
          this.newQuantity= this.originalData.quantity - this.data.quantity;
          this.balance= this.data.price * this.newQuantity;
          trades.push({
            id: this.data.id,
            name: this.data.name,
            price: this.data.price,
            quantity: this.newQuantity,
            balance: this.balance,
            timeStamp: new Date().toISOString(),
          });
         }
        if(this.originalData.quantity < this.data.quantity && this.isChecked==false){
          this.newQuantity= this.data.quantity - this.originalData.quantity;
          this.balance= -(this.data.price * this.newQuantity);
          trades.push({
            id: this.data.id,
            name: this.data.name,
            price: this.data.price,
            quantity: this.newQuantity,
            balance: this.balance,
            timeStamp: new Date().toISOString(),
          });
           }
        if(this.originalData.quantity>this.data.quantity && this.isChecked==true){
          changes.push({
            id: this.data.id,
            type: 'pertes',
            fieldName: 'quantity',
             value: this.data.price,
             oldValue: this.originalData.price,
             timeStamp: new Date().toISOString(),
           })
         }
         this.productService.updateProduct(this.data).subscribe(updatedProduct => {
          // After updating the product, you can save the Historique and Transaction logs
          this.productService.saveHistorique(changes).subscribe(() => {
            console.log('Historique saved successfully!');
          });
          this.productService.saveTransaction(trades).subscribe(() => {
            console.log('Transactions saved successfully!');
          });
         }
        
      this.dialogRef.close(this.data);
    }
  }
}
