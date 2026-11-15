import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageSwitcherComponent } from '../components/language-switcher.component';
import {
  LucideArrowRight,
  LucideArrowUpRight,
  LucideCheck,
  LucideHeart,
  LucideMinus,
  LucidePlus,
  LucideSearch,
  LucideShieldCheck,
  LucideShoppingBag,
  LucideX
} from '@lucide/angular';
import { CatalogService } from '../services/catalog.service';
import { Product, ProductCategory } from '../models/store.models';
import { TranslationService } from '../i18n/translation.service';

type CategoryFilter = 'ALL' | ProductCategory;
interface CartLine { product: Product; quantity: number; }

@Component({
  selector: 'app-storefront-page',
  imports: [LanguageSwitcherComponent, RouterLink, LucideArrowRight, LucideArrowUpRight, LucideCheck, LucideHeart, LucideMinus, LucidePlus, LucideSearch, LucideShieldCheck, LucideShoppingBag, LucideX],
  templateUrl: './storefront.page.html',
  styleUrl: './storefront.page.scss'
})
export class StorefrontPage {
  private readonly catalog = inject(CatalogService);
  protected readonly translations = inject(TranslationService);
  protected readonly products = signal<Product[]>([]);
  protected readonly category = signal<CategoryFilter>('ALL');
  protected readonly query = signal('');
  protected readonly cartOpen = signal(false);
  protected readonly cart = signal<CartLine[]>([]);
  protected readonly favorites = signal<string[]>([]);
  protected readonly notice = signal('');
  protected readonly filteredProducts = computed(() => {
    const query = this.query().trim().toLocaleLowerCase(this.translations.language());
    return this.products().filter((product) => {
      const matchesCategory = this.category() === 'ALL' || product.category === this.category();
      const matchesQuery = !query || `${product.name} ${product.collection}`.toLocaleLowerCase(this.translations.language()).includes(query);
      return matchesCategory && matchesQuery;
    });
  });
  protected readonly cartCount = computed(() => this.cart().reduce((count, line) => count + line.quantity, 0));
  protected readonly cartTotal = computed(() => this.cart().reduce((total, line) => total + line.product.price * line.quantity, 0));

  constructor() {
    this.catalog.getProducts().subscribe((products) => this.products.set(products));
  }

  protected setCategory(category: CategoryFilter): void { this.category.set(category); }

  protected addToCart(product: Product): void {
    this.cart.update((lines) => {
      const existing = lines.find((line) => line.product.id === product.id);
      return existing
        ? lines.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line)
        : [...lines, { product, quantity: 1 }];
    });
    this.notice.set(this.translations.t('notice.added', { name: product.name }));
    window.setTimeout(() => this.notice.set(''), 2600);
  }

  protected changeQuantity(productId: string, delta: number): void {
    this.cart.update((lines) => lines
      .map((line) => line.product.id === productId ? { ...line, quantity: line.quantity + delta } : line)
      .filter((line) => line.quantity > 0));
  }

  protected placeOrder(): void {
    const items = this.cart().map((line) => ({ productId: line.product.id, quantity: line.quantity }));
    if (!items.length) return;

    this.catalog.createOrder({ items }).subscribe({
      next: (order) => {
        this.cart.set([]);
        this.cartOpen.set(false);
        this.notice.set(this.translations.t('notice.order', { id: order.id }));
        window.setTimeout(() => this.notice.set(''), 3500);
      },
      error: () => {
        this.notice.set(this.translations.t('notice.orderError'));
        window.setTimeout(() => this.notice.set(''), 3500);
      }
    });
  }

  protected toggleFavorite(productId: string): void {
    this.favorites.update((items) => items.includes(productId)
      ? items.filter((id) => id !== productId)
      : [...items, productId]);
  }

  protected isFavorite(productId: string): boolean { return this.favorites().includes(productId); }
  protected categoryLabel(category: ProductCategory): string {
    return this.translations.t(category === 'WATCH' ? 'category.watch' : category === 'STRAP' ? 'category.strap' : 'category.accessory');
  }
}