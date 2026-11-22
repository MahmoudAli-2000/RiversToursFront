import { CattourService } from './../../core/services/cattour.service';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, Inject, inject, OnDestroy, OnInit, PLATFORM_ID, signal, ViewChild, WritableSignal, AfterViewInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { Router, RouterLink } from "@angular/router";
import { DestnatoinService } from '../../core/services/destnatoin.service';
import { IDestnation } from '../../core/interfaces/idestnation';
import { Subscription, takeUntil } from 'rxjs';
import { TourService } from '../../core/services/tour.service';
import { ITour } from '../../core/interfaces/itour';
import { HttpErrorResponse } from '@angular/common/http';
import { ICatTour } from '../../core/interfaces/icat-tour';
import { TermtextPipe } from '../../core/pipes/termtext.pipe';
import { CommonModule, isPlatformBrowser, NgClass } from '@angular/common';
import { ReloadableComponent } from '../reloadable/reloadable.component';
import { ReloadService } from '../../core/services/reload.service';
import { TranslatedPipe } from '../../core/pipes/translate.pipe';
import { SeoService } from '../../core/services/seo.service';
import { SwiperCardsDirective } from './swiper-cards.directive';

register();

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, TranslatedPipe, CommonModule, SwiperCardsDirective], // أضف الـ directive هنا
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent extends ReloadableComponent implements OnDestroy, AfterViewInit { // أضف AfterViewInit

  isBrowser: boolean;

  private readonly destnationservice = inject(DestnatoinService);
  private readonly TourService = inject(TourService);
  private readonly CattourService = inject(CattourService);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly cdr = inject(ChangeDetectorRef); // أضف ChangeDetectorRef

  AllPopularToursList: WritableSignal<ITour[]> = signal([]);
  PopularDestanion: WritableSignal<IDestnation[]> = signal([]);
  AllPopularHurghadaCat: WritableSignal<ICatTour[]> = signal([]);

  private observer?: IntersectionObserver;
  private swiperInitialized = false; // متغير لتتبع تهيئة الـ swiper

  @ViewChild('aboutSection', { static: false }) aboutSection?: ElementRef<HTMLElement>;
  @ViewChild('brandNameText', { static: false }) brandNameTextRef?: ElementRef<HTMLElement>;
  @ViewChild('swiperContainer', { static: false }) swiperContainer?: ElementRef<any>; // إضافة ViewChild للـ swiper
  
  constructor(ReloadService: ReloadService, @Inject(PLATFORM_ID) private platformId: object) {
    super(ReloadService);
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.LoadData();
    this.onReload(() => this.LoadData());
    this.LoadDataSeo();
  }

  LoadDataSeo() {
    this.seo.update({
      title: 'Hurghada Tours & Egypt Excursions | Rivers Tours',
      description: 'Discover Hurghada tours, Egypt excursions, Red Sea trips and private transfers with Rivers Tours Travels. Explore Egypt and book your experience.',
      keywords: 'Hurghada tours, Egypt excursions, Red Sea trips, desert safari Hurghada, snorkeling Hurghada, Hurghada airport transfer, Rivers Tours Travels',
      canonicalPath: '/home',
      imageUrl: '/assets/images/rriver.png'
    });
  }

  getCategoryLocation(slug: string): string {
    const normalizedSlug = slug.toLowerCase();

    if (normalizedSlug.includes('marsa-alam')) return 'Marsa Alam';
    if (normalizedSlug.includes('aswan')) return 'Aswan';
    if (normalizedSlug.includes('hurghada') || normalizedSlug.includes('hurgada')) return 'Hurghada';

    return 'Egypt';
  }

  LoadData() {
    this.destnationservice.getAllDestnation()
      .pipe(takeUntil(this.destroy$))
      .subscribe({ 
        next: res => {
          this.PopularDestanion.set(res.data);
          // بعد تحميل البيانات، تأكد من تحديث الـ swiper
          this.reinitSwiperAfterDataLoad();
        }, 
        error: err => console.log(err.message) 
      });

    this.TourService.getAllTours()
      .pipe(takeUntil(this.destroy$))
      .subscribe({ 
        next: res => {
          this.AllPopularToursList.set(res.data);
          this.reinitSwiperAfterDataLoad();
        }, 
        error: err => console.log(err.message) 
      });

    this.CattourService.getAllCAtegorytours()
      .pipe(takeUntil(this.destroy$))
      .subscribe({ 
        next: res => {
          this.AllPopularHurghadaCat.set(res.data);
          this.reinitSwiperAfterDataLoad();
        }, 
        error: err => console.log(err.message) 
      });
  }

  // دالة مساعدة لإعادة تهيئة الـ swiper بعد تحميل البيانات
  private reinitSwiperAfterDataLoad() {
    if (!this.isBrowser) return;
    
    // تأكد أن جميع البيانات قد تم تحميلها
    if (this.AllPopularHurghadaCat().length > 0 && !this.swiperInitialized) {
      setTimeout(() => {
        this.initSwiper();
        this.swiperInitialized = true;
      }, 100);
    }
  }

  // دالة تهيئة الـ swiper يدوياً كحل احتياطي
  private initSwiper() {
    if (!this.swiperContainer?.nativeElement) return;
    
    const swiperEl = this.swiperContainer.nativeElement;
    
    // تأكد من وجود الـ slides
    if (swiperEl.children.length === 0) return;
    
    // إذا كان الـ swiper مهيأ بالفعل، قم بتحديثه
    if (swiperEl.swiper) {
      swiperEl.swiper.update();
      swiperEl.swiper.updateSlides();
      return;
    }
    
    // خيارات الـ swiper
    Object.assign(swiperEl, {
      effect: 'cards',
      grabCursor: true,
      loop: true,
      speed: 1200,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      touchRatio: 1.2,
      cardsEffect: {
        rotate: 0,
        perSlideOffset: 18,
        slideShadows: false,
      },
      breakpoints: {
        0: { width: 280, height: 380 },
        576: { width: 380, height: 430 },
        768: { width: 460, height: 500 },
        992: { width: 520, height: 520 },
      },
    });
    
    // تهيئة الـ swiper
    swiperEl.initialize();
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    // تهيئة تأثير about section
    const aboutEl = this.aboutSection?.nativeElement;
    if (aboutEl) {
      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                aboutEl.classList.add('is-visible');
                this.observer?.disconnect();
              }
            });
          },
          { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
        );
        this.observer.observe(aboutEl);
      } else {
        aboutEl.classList.add('is-visible');
      }
    }

    this.initBrandNameAnimation();

    // إذا كانت البيانات محملة مسبقاً، قم بتهيئة الـ swiper
    if (this.AllPopularHurghadaCat().length > 0) {
      setTimeout(() => {
        this.initSwiper();
        this.swiperInitialized = true;
      }, 100);
    }
  }

  private initBrandNameAnimation() {
    const element = this.brandNameTextRef?.nativeElement;
    if (!element || !this.isBrowser) return;

    const textNode = Array.from(element.childNodes).find(
      (node): node is Text => node.nodeType === Node.TEXT_NODE
    );
    const text = textNode?.textContent;
    if (!text || !textNode) return;

    const fragment = element.ownerDocument.createDocumentFragment();
    Array.from(text).forEach((character, index) => {
      const letter = element.ownerDocument.createElement('span');
      letter.className = 'brand-letter';
      letter.style.setProperty('--letter-delay', `${index * 75}ms`);
      letter.style.setProperty('--letter-sway', `${index % 2 === 0 ? -2 : 2}deg`);

      const movingLetter = element.ownerDocument.createElement('span');
      movingLetter.className = 'brand-letter-motion';
      movingLetter.textContent = character;
      letter.appendChild(movingLetter);
      fragment.appendChild(letter);
    });

    textNode.replaceWith(fragment);
  }

  videoFallback = false;


}