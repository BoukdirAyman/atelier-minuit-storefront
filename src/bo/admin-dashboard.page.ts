import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideArrowDownRight,
  LucideArrowRight,
  LucideArrowUpRight,
  LucideBell,
  LucideChartColumnIncreasing,
  LucideChevronDown,
  LucideCircleDollarSign,
  LucideClock3,
  LucideLayoutDashboard,
  LucidePackage,
  LucideSearch,
  LucideSettings2,
  LucideShoppingBag,
  LucideTruck,
  LucideUsers
} from '@lucide/angular';
import { LanguageSwitcherComponent } from '../app/components/language-switcher.component';
import { OrderStatus, Product, StoreOrder } from '../app/models/store.models';
import { TranslationService } from '../app/i18n/translation.service';
import { CatalogService } from '../app/services/catalog.service';

type OrderFilter = 'ALL' | OrderStatus;

@Component({
  selector: 'app-admin-dashboard-page',
  imports: [DatePipe, LanguageSwitcherComponent, RouterLink, LucideArrowDownRight, LucideArrowRight, LucideArrowUpRight, LucideBell, LucideChartColumnIncreasing, LucideChevronDown, LucideCircleDollarSign, LucideClock3, LucideLayoutDashboard, LucidePackage, LucideSearch, LucideSettings2, LucideShoppingBag, LucideTruck, LucideUsers],
  templateUrl: './admin-dashboard.page.html',
  styleUrl: './admin-dashboard.page.scss'
})
export class AdminDashboardPage {
  private readonly catalog = inject(CatalogService);
  protected readonly translations = inject(TranslationService);
  protected readonly demoDate = new Date('2026-11-14T12:00:00');
  protected readonly products = signal<Product[]>([]);
  protected readonly orders = signal<StoreOrder[]>([]);
  protected readonly query = signal('');
  protected readonly orderFilter = signal<OrderFilter>('ALL');
  protected readonly feedback = signal('');
  protected readonly filteredOrders = computed(() => {
    const query = this.query().trim().toLocaleLowerCase(this.translations.language());
    return this.orders().filter((order) => {
      const matchesStatus = this.orderFilter() === 'ALL' || order.status === this.orderFilter();
      const matchesQuery = !query || `${order.id} ${order.customer} ${order.email}`.toLocaleLowerCase(this.translations.language()).includes(query);
      return matchesStatus && matchesQuery;
    });
  });
  protected readonly lowStockProducts = computed(() => this.products().filter((product) => product.stock <= 5));

  constructor() {
    this.catalog.getProducts().subscribe((products) => this.products.set(products));
    this.catalog.getOrders().subscribe((orders) => this.orders.set(orders));
  }

  protected changeOrderStatus(orderId: string, status: OrderStatus): void {
    this.catalog.updateOrderStatus(orderId, status).subscribe({
      next: (updatedOrder) => {
        this.orders.update((orders) => orders.map((order) => order.id === orderId
          ? { ...order, status: updatedOrder?.status ?? status }
          : order));
        this.feedback.set(this.translations.t('admin.updated', { id: orderId }));
        window.setTimeout(() => this.feedback.set(''), 2600);
      },
      error: () => this.feedback.set(this.translations.t('admin.updateError'))
    });
  }

  protected statusLabel(status: OrderStatus): string {
    return this.translations.t(status === 'PROCESSING' ? 'admin.status.processing' : status === 'SHIPPED' ? 'admin.status.shipped' : 'admin.status.delivered');
  }

  protected statusClass(status: OrderStatus): string {
    return status === 'PROCESSING' ? 'processing' : status === 'SHIPPED' ? 'shipped' : 'delivered';
  }
}