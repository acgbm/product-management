import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

// Define an interface for product data
export interface Product {
  id?: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = `${environment.apiBaseUrl}`;  // Base URL for the Fake Store API

  constructor(private http: HttpClient) { }

  // Get all products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`)
      .pipe(
        catchError(this.handleError<Product[]>('getProducts', []))
      );
  }

  // Get a single product by ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`)
      .pipe(
        catchError(this.handleError<Product>('getProductById'))
      );
  }

  // Get limited products (e.g., top 5)
  getLimitedProducts(limit: number = 5): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => products.slice(0, limit))
    );
  }

  // Sort products by price or rating
  getSortedProducts(sortBy: 'price' | 'rating', order: 'asc' | 'desc' = 'asc'): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => {
        return products.sort((a, b) => {
          const compareA = sortBy === 'price' ? a.price : (a.rating?.rate || 0);
          const compareB = sortBy === 'price' ? b.price : (b.rating?.rate || 0);
          return order === 'asc' ? compareA - compareB : compareB - compareA;
        });
      })
    );
  }

  // Get all categories
  getCategories(): Observable<string[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`)
      .pipe(
        map(products => {
          const categories = new Set(products.map(product => product.category));
          return Array.from(categories);
        }),
        catchError(this.handleError<string[]>('getCategories', []))
      );
  }

  // Get products by category
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => products.filter(product => product.category === category))
    );
  }

  // Add a new product
  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, product, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(this.handleError<Product>('addProduct'))
    );
  }

  // Update a product
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, product, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(this.handleError<Product>('updateProduct'))
    );
  }

  // Delete a product
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`)
      .pipe(
        catchError(this.handleError<void>('deleteProduct'))
      );
  }

  // Handle errors
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
