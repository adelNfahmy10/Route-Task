import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductService } from '../../core/services/product/product.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit{
  private readonly _ProductService = inject(ProductService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _ToastrService = inject(ToastrService)

  ngOnInit(): void {
    this.getProductById()
    const storedCart = localStorage.getItem('cartProducts');
    const parsedCart = storedCart ? JSON.parse(storedCart) : [];
    this._ProductService.cartCount.set(parsedCart.length)
  }
  productDetails:WritableSignal<any> = signal({})

  getProductById():void{
    this._ActivatedRoute.paramMap.subscribe({
      next:(params)=>{
        let productId = params.get('id')
        this._ProductService.getAllProductById(productId).subscribe({
          next:(res) => {
            this.productDetails.set(res)
          }
        })
      }
    })
  }

  addToCart(product: any) {
    const existingCart = JSON.parse(localStorage.getItem('cartProducts') || '[]');

    const alreadyInCart = existingCart.some((item: any) => item.id === product.id);
    if (!alreadyInCart) {
      existingCart.push(product);
      localStorage.setItem('cartProducts', JSON.stringify(existingCart));
      localStorage.setItem('cartCount', existingCart.length.toString());
      this._ProductService.cartCount.set(existingCart.length)
      this._ToastrService.success('Product added to cart successfully!', 'Cart Updated');
    } else {
      this._ToastrService.error('Product is already in the cart.', 'Cart');
    }
  }
}
