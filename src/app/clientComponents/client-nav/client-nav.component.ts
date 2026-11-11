import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { TranslatedPipe } from '../../core/pipes/translate.pipe';
import { TranslationService } from '../../core/services/translation.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-client-nav',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,TranslatedPipe],
  templateUrl: './client-nav.component.html',
  styleUrl: './client-nav.component.css'
})
export class ClientNavComponent implements OnInit {

  isBrowser: boolean;

  isScrolled = false;
  isOffcanvasOpen = false;
  activeDropdown: string | null = null;
  isDestinationDropdownDismissed = false;
  isMoreDropdownDismissed = false;

  @ViewChild('offcanvasPanel') offcanvasPanel?: ElementRef<HTMLElement>;
  @ViewChild('offcanvasCloseBtn') offcanvasCloseBtn?: ElementRef<HTMLButtonElement>;

  private lastActiveEl: HTMLElement | null = null;
  private scrollY = 0;
  private routeSubscription?: ReturnType<Router['events']['subscribe']>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private langService: LanguageService,
    private translationService: TranslationService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.onWindowScroll();
    }

    this.routeSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeDropdown = null;
        this.isDestinationDropdownDismissed = true;
        this.isMoreDropdownDismissed = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  // =========================
  // Scroll
  // =========================
  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!this.isBrowser) return;

    const scrollPosition =
      window.pageYOffset || document.documentElement.scrollTop || 0;

    this.isScrolled = scrollPosition > 50;
  }

  // =========================
  // Offcanvas
  // =========================
  toggleOffcanvas(): void {
    if (this.isOffcanvasOpen) {
      this.closeOffcanvas();
      return;
    }

    this.isOffcanvasOpen = true;
    if (this.isBrowser) this.openOffcanvasSideEffects();
  }

  closeOffcanvas(): void {
    if (!this.isOffcanvasOpen) return;

    this.isOffcanvasOpen = false;
    this.activeDropdown = null;

    if (this.isBrowser) this.closeOffcanvasSideEffects();
  }

  private openOffcanvasSideEffects(): void {
    if (!this.isBrowser) return;

    this.lastActiveEl = document.activeElement as HTMLElement | null;
    this.scrollY = window.scrollY || document.documentElement.scrollTop || 0;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    queueMicrotask(() => {
      this.offcanvasCloseBtn?.nativeElement?.focus?.();
    });
  }

  private closeOffcanvasSideEffects(): void {
    if (!this.isBrowser) return;

    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    window.scrollTo(0, this.scrollY);
    this.lastActiveEl?.focus?.();
    this.lastActiveEl = null;
  }

  // =========================
  // Dropdown
  // =========================
  toggleDropdown(event: Event, dropdownName: string): void {
    // منع انتشار الحدث فقط، لا تستخدم preventDefault
    event.stopPropagation();
    
    // تغيير الحالة
    if (this.activeDropdown === dropdownName) {
      this.activeDropdown = null;
    } else {
      // أغلق أي قائمة مفتوحة أولاً
      this.activeDropdown = dropdownName;
    }
  }

  dismissDestinationDropdown(): void {
    this.isDestinationDropdownDismissed = true;
  }

  reopenDestinationDropdowns(): void {
    this.isDestinationDropdownDismissed = false;
  }

  closeMoreDropdown(event: Event): void {
    this.activeDropdown = null;
    this.isMoreDropdownDismissed = true;

    if (event instanceof MouseEvent && event.detail > 0 && event.currentTarget instanceof HTMLElement) {
      event.currentTarget.blur();
    }
  }

  // =========================
  // Keyboard Events
  // =========================
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (!this.isBrowser) return;

    if (this.isOffcanvasOpen) {
      this.closeOffcanvas();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.isBrowser) return;
    if (!this.isOffcanvasOpen) return;
    if (event.key !== 'Tab') return;

    const root = this.offcanvasPanel?.nativeElement;
    if (!root) return;

    const focusables = Array.from(
      root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(
      (el) =>
        !el.hasAttribute('disabled') &&
        el.tabIndex !== -1 &&
        el.offsetParent !== null
    );

    if (focusables.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (event.shiftKey) {
      if (!active || active === first || !root.contains(active)) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (!active || active === last || !root.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  // =========================
  // Language
  // =========================
  changeLang(lang: 'en' | 'de' | 'pl'  | 'fr'): void {
    this.langService.setLanguage(lang);
    this.translationService.setLang(lang);
  }
}