import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../shared/product.service';
import { PopupComponent } from '../popup/popup.component';
import { Product } from '../Model/product';
import * as alertify from 'alertifyjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html'
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(id).subscribe({
        next: (data: Product) => {
          // Ensure ID is properly assigned from MongoDB response
          this.product = {
            ...data,
            id: id // Explicitly set the ID from the route parameter
          };
          this.loading = false;
        },
        error: (err) => {
          console.error('Error:', err);
          alertify.error('Failed to load product details');
          this.loading = false;
        }
      });
    }
  }

  editProduct(id: string): void {
    const popup = this.dialog.open(PopupComponent, {
      width: '500px',
      exitAnimationDuration: '1000ms',
      enterAnimationDuration: '1000ms',
      data: { id: id }
    });

    popup.afterClosed().subscribe(result => {
      if (result) {
        this.ngOnInit(); // Reload product details after edit
      }
    });
  }
}