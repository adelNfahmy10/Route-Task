import { Component,inject,OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product/product.service';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit{
  private readonly _ProductService = inject(ProductService)
  private readonly _ToastrService = inject(ToastrService)
  cartItems: any[] = [];
  total: number = 0;

  ngOnInit(): void {
    const storedCart = localStorage.getItem('cartProducts');
    this.cartItems = storedCart ? JSON.parse(storedCart) : [];
    this._ProductService.cartCount.set(this.cartItems.length)
    this.calculateTotal();
  }

  removeItem(index: number): void {
    this.cartItems.splice(index, 1);
    localStorage.setItem('cartProducts', JSON.stringify(this.cartItems));
    localStorage.setItem('cartCount', this.cartItems.length.toString());
    this._ProductService.cartCount.set(this.cartItems.length)
    this.calculateTotal();
    this._ToastrService.success('Deleted Successfully!', 'Delete Product From Cart');
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) => sum + item.price, 0);
  }

  checkout(): void {
    alert('Redirecting to payment gateway...');
  }
}
