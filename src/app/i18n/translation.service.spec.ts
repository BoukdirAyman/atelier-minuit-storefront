import { TestBed } from '@angular/core/testing';
import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  let translations: TranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    translations = TestBed.inject(TranslationService);
  });

  it('uses French by default and formats amounts in DH', () => {
    expect(translations.t('nav.watches')).toBe('Montres');
    expect(translations.money(420)).toBe('420 DH');
  });

  it('switches translations and number formatting with the selected language', () => {
    translations.setLanguage('en');
    expect(translations.t('nav.watches')).toBe('Watches');
    expect(translations.percent(12.8)).toBe('12.8%');

    translations.setLanguage('ar');
    expect(translations.t('nav.watches')).toBe('الساعات');
    expect(translations.money(420)).toContain('DH');
  });
});
