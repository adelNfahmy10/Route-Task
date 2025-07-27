import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, single } from 'rxjs';
import { environment } from '../../environment/environment';
import { IProduct } from '../../interfaces/iproduct';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly _HttpClient = inject(HttpClient)

  cartProducts:WritableSignal<IProduct[]> = signal([])
  cartCount:WritableSignal<any> = signal(0)


  getAllProduct():Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}products`)
  }

  getAllProductById(id:any):Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}products/${id}`)
  }

}
