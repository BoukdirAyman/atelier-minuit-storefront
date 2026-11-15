import { Component, inject } from '@angular/core';
import { TranslationService } from '../i18n/translation.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  template: `
    <label class="language-switcher">
      <span class="sr-only">{{ translations.t('language.label') }}</span>
      <select [attr.aria-label]="translations.t('language.label')" [value]="translations.language()" (change)="changeLanguage($event)">
        <option value="fr">Français</option>
        <option value="ar">العربية</option>
        <option value="en">English</option>
      </select>
    </label>
  `,
  styles: [`
    .language-switcher { display: inline-flex; align-items: center; }
    select { min-height: 34px; padding: 0 25px 0 9px; border: 1px solid var(--line, #e6e9e4); border-radius: 2px; background: transparent; color: inherit; cursor: pointer; font-size: 10px; }
  `]
})
export class LanguageSwitcherComponent {
  protected readonly translations = inject(TranslationService);

  protected changeLanguage(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (this.translations.isLanguage(value)) {
      this.translations.setLanguage(value);
    }
  }
}
