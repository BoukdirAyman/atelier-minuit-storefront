import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateOrderRequest, OrderStatus, Product, StoreOrder } from '../models/store.models';

const DEMO_PRODUCTS: Product[] = [
  { id: 'am-01', name: 'La Minuit 38', collection: 'Série Héritage', category: 'WATCH', price: 420, imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85', badge: 'NOUVEAUTÉ', stock: 12 },
  { id: 'am-02', name: 'La Sépia 40', collection: 'Série Héritage', category: 'WATCH', price: 560, imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=85', badge: 'ÉDITION LIMITÉE', stock: 4 },
  { id: 'am-03', name: 'La Ligne 36', collection: 'Série Contemporaine', category: 'WATCH', price: 385, imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=85', stock: 8 },
  { id: 'am-04', name: 'La Traverse 42', collection: 'Série Sport', category: 'WATCH', price: 490, imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85', badge: 'BEST-SELLER', stock: 16 },
  { id: 'am-05', name: 'Bracelet Atlas', collection: 'Cuir pleine fleur', category: 'STRAP', price: 75, imageUrl: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=900&q=85', stock: 21 },
  { id: 'am-06', name: 'Bracelet Rivage', collection: 'Acier brossé', category: 'STRAP', price: 95, imageUrl: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=900&q=85', stock: 3 },
  { id: 'am-07', name: 'Étui de voyage', collection: 'Cuir végétal', category: 'ACCESSORY', price: 110, imageUrl: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=900&q=85', stock: 9 },
  { id: 'am-08', name: 'Boîte Atelier', collection: 'Noyer massif', category: 'ACCESSORY', price: 145, imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85', stock: 6 }
];

const DEMO_ORDERS: StoreOrder[] = [
  { id: 'AM-2048', customer: 'Camille Laurent', email: 'camille.laurent@email.fr', itemSummary: 'La Minuit 38 · Bracelet Atlas', total: 495, status: 'PROCESSING', createdAt: '2026-11-14T10:42:00' },
  { id: 'AM-2047', customer: 'Thomas Moreau', email: 't.moreau@email.fr', itemSummary: 'La Traverse 42', total: 490, status: 'SHIPPED', createdAt: '2026-11-14T09:18:00' },
  { id: 'AM-2046', customer: 'Sarah Petit', email: 'sarah.petit@email.fr', itemSummary: 'Étui de voyage', total: 110, status: 'DELIVERED', createdAt: '2026-11-13T16:05:00' },
  { id: 'AM-2045', customer: 'Hugo Bernard', email: 'hugo.bernard@email.fr', itemSummary: 'La Sépia 40', total: 560, status: 'PROCESSING', createdAt: '2026-11-13T13:26:00' },
  { id: 'AM-2044', customer: 'Inès Robert', email: 'ines.robert@email.fr', itemSummary: 'Bracelet Rivage · La Ligne 36', total: 480, status: 'SHIPPED', createdAt: '2026-11-12T11:09:00' }
];

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiBaseUrl;

  getProducts(): Observable<Product[]> {
    return environment.useMockApi ? of(DEMO_PRODUCTS) : this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  getOrders(): Observable<StoreOrder[]> {
    return environment.useMockApi ? of(DEMO_ORDERS) : this.http.get<StoreOrder[]>(`${this.apiUrl}/orders`);
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Observable<StoreOrder | void> {
    return environment.useMockApi
      ? of(undefined)
      : this.http.patch<StoreOrder>(`${this.apiUrl}/orders/${orderId}/status`, { status });
  }

  createOrder(request: CreateOrderRequest): Observable<{ id: string }> {
    return environment.useMockApi
      ? of({ id: `AM-DEMO-${Date.now().toString().slice(-6)}` })
      : this.http.post<{ id: string }>(`${this.apiUrl}/orders`, request);
  }
}