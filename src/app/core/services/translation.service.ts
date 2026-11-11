import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { EN } from '../../../assets/i18n/en';
import { DE } from '../../../assets/i18n/de';
import { PL } from '../../../assets/i18n/pl';

import { FR } from '../../../assets/i18n/FR';


export type Lang = 'en' | 'de' | 'pl' |'fr';

@Injectable({ providedIn: 'root' })
export class TranslationService {

  private storageKey = 'lang';
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  lang = signal<Lang>(this.getInitialLang());

  private translations = {
    en: EN,
    de: DE,
    pl: PL,
   
    fr:FR
  };

  // ✅ قراءة اللغة بأمان
  private getInitialLang(): Lang {
    if (this.isBrowser) {
      return (localStorage.getItem(this.storageKey) as Lang) || 'en';
    }
    return 'en'; // SSR fallback
  }

  t(key: string): string {
    return key.split('.').reduce(
      (obj: any, k) => obj?.[k],
      this.translations[this.lang()]
    ) ?? key;
  }

  // ✅ حفظ اللغة بأمان
  setLang(lang: Lang) {
    if (this.isBrowser) {
      localStorage.setItem(this.storageKey, lang);
    }
    this.lang.set(lang);
  }
}
