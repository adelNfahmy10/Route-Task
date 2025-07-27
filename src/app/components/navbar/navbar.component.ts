import { Component, computed, effect, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProductService } from '../../core/services/product/product.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent{
  private readonly _ProductService = inject(ProductService)

  cartCount:Signal<number> = computed ( () => this._ProductService.cartCount()  )

  constructor(){
    effect(() => {
      localStorage.setItem('cartCount', this.cartCount().toString());
    });
  }

}
