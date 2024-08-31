import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';  // Import ReactiveFormsModule
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { AppRoutingModule } from './app-routing.module';  // Import AppRoutingModule
import { AppComponent } from './app.component';
import { ProductsComponent } from './products/products.component';  // Import ProductsComponent

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent  // Declare ProductsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,  // Import RouterModule
    ReactiveFormsModule,  // Import ReactiveFormsModule
    HttpClientModule  // Import HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
