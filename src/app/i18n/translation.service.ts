import { DOCUMENT } from '@angular/common';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import ar from './locales/ar.json';
import en from './locales/en.json';
import fr from './locales/fr.json';

export type Language = 'fr' | 'ar' | 'en';

const translations: Record<Language, Record<string, string>> = { fr, ar, en };
const locales: Record<Language, string> = { fr: 'fr-FR', ar: 'ar-MA', en: 'en-US' };

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly document = inject(DOCUMENT);
  readonly language = signal<Language>('fr');
  readonly locale = computed(() => locales[this.language()]);

  constructor() {
    effect(() => {
      const language = this.language();
      this.document.documentElement.lang = locales[language];
      this.document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    });
  }

  setLanguage(language: Language): void {
    this.language.set(language);
  }

  isLanguage(value: string): value is Language {
    return value === 'fr' || value === 'ar' || value === 'en';
  }

  t(key: string, params: Record<string, string | number> = {}): string {
    let value = translations[this.language()][key] ?? translations.fr[key] ?? key;
    for (const [name, replacement] of Object.entries(params)) {
      value = value.replaceAll(`{{${name}}}`, String(replacement));
    }
    return value;
  }

  money(amount: number): string {
    const formattedAmount = new Intl.NumberFormat(locales[this.language()], {
      maximumFractionDigits: 2
    }).format(amount);
    return `${formattedAmount} DH`;
  }

  percent(value: number): string {
    const formattedValue = new Intl.NumberFormat(locales[this.language()], {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value);
    return `${formattedValue}%`;
  }

  collectionName(name: string): string {
    const keyByName: Record<string, string> = {
      'Série Héritage': 'collection.heritage',
      'Série Contemporaine': 'collection.contemporary',
      'Série Sport': 'collection.sport',
      'Cuir pleine fleur': 'collection.fullGrainLeather',
      'Acier brossé': 'collection.brushedSteel',
      'Cuir végétal': 'collection.vegetableLeather',
      'Noyer massif': 'collection.solidWalnut'
    };
    const key = keyByName[name];
    return key ? this.t(key) : name;
  }

  productBadge(badge: string): string {
    const keyByBadge: Record<string, string> = {
      'NOUVEAUTÉ': 'product.badge.new',
      'ÉDITION LIMITÉE': 'product.badge.limited',
      'BEST-SELLER': 'product.badge.bestSeller'
    };
    const key = keyByBadge[badge];
    return key ? this.t(key) : badge;
  }
}
