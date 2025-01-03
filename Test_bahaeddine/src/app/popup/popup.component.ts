import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as alertify from 'alertifyjs';
import { ProductService } from '../shared/product.service';
import { Product } from '../Model/product';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
  productForm: FormGroup;

  constructor(
    private builder: FormBuilder,
    private dialogRef: MatDialogRef<PopupComponent>,
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: { id: string }
  ) {
    this.productForm = this.builder.group({
      id: [''],
      nom: ['', Validators.required],
      prix: ['', [Validators.required, Validators.min(0)]],
      categorie: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data?.id) {
      this.loadProduct(this.data.id);
    }
  }

  private loadProduct(id: string): void {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          id: product.id,
          nom: product.nom,
          prix: product.prix,
          categorie: product.categorie
        });
      },
      error: (error) => {
        console.error('Error loading product:', error);
        alertify.error('Failed to load product details');
      }
    });
  }

  saveProduct(): void {
    if (this.productForm.valid) {
      const product: Product = this.productForm.value;
      
      const operation = this.data?.id ?
        this.productService.updateProduct(this.data.id, product) :
        this.productService.addProduct(product);

      operation.subscribe({
        next: () => {
          alertify.success(`Product ${this.data?.id ? 'updated' : 'saved'} successfully`);
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error saving product:', error);
          alertify.error('Failed to save product');
        }
      });
    } else {
      alertify.error('Please fill all required fields');
    }
  }

  closePopup(): void {
    this.dialogRef.close();
  }
}