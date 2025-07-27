import { Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';

export const routes: Routes = [
  { path: '', redirectTo:'products', pathMatch: 'full'},
  { path: 'products', component:ProductsComponent, title:'Products'},
  { path: 'details/:id', loadComponent:()=> import('./components/product-details/product-details.component').then(c => c.ProductDetailsComponent), title:'Products Details'},
  { path: 'cart',loadComponent:()=> import('./components/cart/cart.component').then(c => c.CartComponent), title:'Cart'},
  { path: '**', loadComponent:()=> import('./components/notfound/notfound.component').then(c => c.NotfoundComponent), title:'Not Found'},
];
