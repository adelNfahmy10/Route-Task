import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductService } from '../../core/services/product/product.service';
import { IProduct } from '../../core/interfaces/iproduct';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductsComponent implements OnInit{
  private readonly _ProductService = inject(ProductService)
  private readonly _ToastrService = inject(ToastrService)

  Math = Math;
  allProducts:WritableSignal<IProduct[]> = signal([])
  cartProducts:WritableSignal<any> = signal([])
  searchName: string = '';
  selectedCategory: string = '';

  ngOnInit(): void {
    this.getAllProducts()
    const storedCart = localStorage.getItem('cartProducts');
    const parsedCart = storedCart ? JSON.parse(storedCart) : [];
    this.cartProducts.set(parsedCart);
    this._ProductService.cartCount.set(parsedCart.length)
  }

  getAllProducts():void{
    this._ProductService.getAllProduct().subscribe({
      next:(res)=>{
        this.allProducts.set(res)
      }
    })
  }

  get allCategories(): string[] {
    const categories = this.allProducts().map(p => p.category);
    return Array.from(new Set(categories));
  }

  filteredProducts() {
    let filtered = this.allProducts().filter(product => {
      const matchesName = product.title.toLowerCase().includes(this.searchName.toLowerCase());
      const matchesCategory = this.selectedCategory ? product.category === this.selectedCategory : true;
      return matchesName && matchesCategory;
    });

    // Apply sorting
    switch (this.sortOption) {
      case 'priceLowToHigh':
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighToLow':
        filtered = filtered.sort((a, b) => b.price - a.price);
        break;
      case 'nameAZ':
        filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return filtered;
  }


  addToCart(product: any): void {
    const isExists =  this.cartProducts().some((p:any) => p.id === product.id);
    if (!isExists) {
      this.cartProducts().push(product);
      this._ToastrService.success('Product added to cart successfully!', 'Cart Updated');

      const updatedCart = this.cartProducts();
      localStorage.setItem('cartProducts', JSON.stringify(updatedCart));

      const count = updatedCart.length;
      localStorage.setItem('cartCount', count.toString());

      this._ProductService.cartCount.set(count);
    } else {
      this._ToastrService.error('Product is already in the cart.', 'Cart');
    }
  }

  sortOption: string = '';

}
