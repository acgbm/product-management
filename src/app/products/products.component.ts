import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService, Product } from '../api.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];
  categories: string[] = [];
  selectedCategory: string = '';
  addProductForm: FormGroup;
  updateProductForm: FormGroup;

  constructor(private apiService: ApiService, private fb: FormBuilder) {
    // Initialize forms with FormBuilder
    this.addProductForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      image: ['']
    });

    this.updateProductForm = this.fb.group({
      id: [0, Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      image: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadProducts(): void {
    if (this.selectedCategory) {
      this.apiService.getProductsByCategory(this.selectedCategory).subscribe(
        data => this.products = data,
        error => console.error('Error fetching products', error)
      );
    } else {
      this.apiService.getLimitedProducts(5).subscribe(
        data => this.products = data,
        error => console.error('Error fetching products', error)
      );
    }
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe(
      data => this.categories = data,
      error => console.error('Error fetching categories', error)
    );
  }

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCategory = target.value;
    this.loadProducts();
  }

  addProduct(): void {
    if (this.addProductForm.valid) {
      const formValue = this.addProductForm.value;
      const product: Product = {
        title: formValue.title,
        description: formValue.description,
        price: formValue.price ?? 0,  // Default to 0 if undefined
        category: formValue.category,
        image: formValue.image
      };
      this.apiService.addProduct(product).subscribe(
        () => {
          this.loadProducts();
          this.addProductForm.reset();
        },
        error => console.error('Error adding product', error)
      );
    }
  }

  updateProduct(): void {
    if (this.updateProductForm.valid) {
      const formValue = this.updateProductForm.value;
      const product: Product = {
        id: formValue.id,
        title: formValue.title,
        description: formValue.description,
        price: formValue.price ?? 0,  // Default to 0 if undefined
        category: formValue.category,
        image: formValue.image
      };
      
      // Ensure product.id is defined before making the API call
      if (product.id !== undefined) {
        this.apiService.updateProduct(product.id, product).subscribe(
          () => {
            this.loadProducts();
            this.updateProductForm.reset();
          },
          error => console.error('Error updating product', error)
        );
      } else {
        console.error('Product ID is undefined');
      }
    }
  }
}
