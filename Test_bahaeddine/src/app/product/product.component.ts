import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '../Model/product';
import { PopupComponent } from '../popup/popup.component';
import { ProductService } from '../shared/product.service';
import * as alertify from 'alertifyjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private productService: ProductService,
    private breakpointObserver: BreakpointObserver
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  productData: Product[] = []; // Ensure it's initialized as an empty array
  finalData: MatTableDataSource<Product> = new MatTableDataSource(); // Initialize to avoid null reference
  isMobileView: boolean = false;

  displayColumns: string[] = ["id", "nom", "prix", "categorie", "action"];

  ngOnInit(): void {
    this.loadProducts();

    // Dynamically adapt columns based on screen size
    this.breakpointObserver.observe(['(max-width: 768px)', '(max-width: 1024px)']).subscribe(result => {
      if (result.breakpoints['(max-width: 768px)']) {
        this.displayColumns = ['id', 'nom', 'categorie', 'action'];
      } else if (result.breakpoints['(max-width: 1024px)']) {
        this.displayColumns = ['id', 'nom', 'prix', 'action'];
      } else {
        this.displayColumns = ["id", "nom", "prix", "categorie", "action"];
      }
    });
  }

  openPopup(id: any): void {
    const popup = this.dialog.open(PopupComponent, {
      width: '500px',
      exitAnimationDuration: '1000ms',
      enterAnimationDuration: '1000ms',
      data: { id: id }
    });
    popup.afterClosed().subscribe(() => this.loadProducts());
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (response) => {
        this.productData = response || [];  // Si la réponse est vide, renvoie un tableau vide
        this.finalData = new MatTableDataSource<Product>(this.productData);
        this.finalData.paginator = this.paginator;
        this.finalData.sort = this.sort;
      },
      error: (err) => {
        alertify.error('Failed to load products. Please try again.');
        console.error('Error loading products:', err);
      }
    });
  }
  

  editProduct(id: any): void {
    this.openPopup(id);
  }

  removeProduct(id: any): void {
    alertify.confirm(
      "Remove Product",
      "Do you want to remove this product?",
      () => {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            alertify.success('Product removed successfully');
            this.loadProducts();
          },
          error: (err) => {
            alertify.error('Failed to remove product. Please try again.');
            console.error('Error removing product:', err);
          }
        });
      },
      () => {
        // Cancel logic
      }
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.finalData.filter = filterValue.trim().toLowerCase();

    if (this.finalData.paginator) {
      this.finalData.paginator.firstPage();
    }
  }
}
