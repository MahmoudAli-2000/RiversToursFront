import { AfterViewInit, Directive, ElementRef, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: 'swiper-container[cardsDirective]',
  standalone: true
})
export class SwiperCardsDirective implements AfterViewInit, OnDestroy {
  private swiperEl: any;
  private isBrowser: boolean;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.swiperEl = el.nativeElement;
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    // تأخير للتأكد من وجود الـ slides
    setTimeout(() => {
      this.initSwiper();
    }, 0);
  }

  private initSwiper(): void {
    if (!this.swiperEl) return;

    // التأكد من وجود slides
    const slides = this.swiperEl.querySelectorAll('swiper-slide');
    if (slides.length === 0) {
      setTimeout(() => this.initSwiper(), 100);
      return;
    }

    // تعيين الخيارات
    Object.assign(this.swiperEl, {
      effect: 'cards',
      grabCursor: true,
      loop: true,
      speed: 1200,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false, // مهم: يستمر بعد التفاعل
        pauseOnMouseEnter: false,
        waitForTransition: true,
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
      on: {
        init: () => {
          // بعد التهيئة، تأكد من بدء الـ autoplay
          setTimeout(() => {
            if (this.swiperEl?.swiper?.autoplay) {
              this.swiperEl.swiper.autoplay.start();
            }
          }, 100);
        },
        slideChangeTransitionEnd: () => {
          // بعد تغيير الشريحة، تأكد من استمرار الـ autoplay
          if (this.swiperEl?.swiper?.autoplay && !this.swiperEl.swiper.autoplay.running) {
            this.swiperEl.swiper.autoplay.start();
          }
        }
      }
    });

    // تهيئة الـ Swiper
    this.swiperEl.initialize();
  }

  ngOnDestroy(): void {
    if (this.swiperEl && this.swiperEl.swiper && !this.swiperEl.swiper.destroyed) {
      try {
        if (this.swiperEl.swiper.autoplay) {
          this.swiperEl.swiper.autoplay.stop();
        }
        this.swiperEl.swiper.destroy(true, true);
      } catch (e) {
        // تجاهل الأخطاء
      }
    }
  }
}