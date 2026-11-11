import { Meta, Title } from '@angular/platform-browser';
import { TranslatedPipe } from './../../core/pipes/translate.pipe';
import {
  Component,
  OnInit,
  inject,
  ElementRef,
  AfterViewInit,
  ViewChild,
  Inject,
  PLATFORM_ID
} from '@angular/core';

import { Observable, interval, map, take, BehaviorSubject } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface Stat {
  icon: string;
  target: number;
  text: string;
  value$: BehaviorSubject<number>;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [TranslatedPipe, CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, AfterViewInit {

  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  private isBrowser: boolean;

  stats: Stat[] = [];

  @ViewChild('statsSection') statsSection!: ElementRef;

  private counted = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // SEO شغال عادي في SSR ✅
    this.title.setTitle(
      'About Rivers Tours Travels | Trusted Travel Agency in Hurghada'
    );

    this.meta.updateTag({
      name: 'description',
      content:
        'Rivers Tours Travels is a professional travel agency based in Hurghada, Egypt, offering tours, excursions, desert safaris, and sea trips across Egypt with trusted local guides.'
    });

    this.meta.updateTag({
      name: 'keywords',
      content:
        'Rivers Tours Travels, Hurghada travel agency, Egypt tours, Hurghada excursions, Red Sea tours'
    });

    this.stats = [
      { icon: 'fas fa-people-group', target: 500, text: 'ABOUTSTATSCLIENTS', value$: new BehaviorSubject<number>(0) },
      { icon: 'fas fa-map-location-dot', target: 120, text: 'ABOUTSTATSTOURS', value$: new BehaviorSubject<number>(0) },
      { icon: 'fas fa-calendar-check', target: 3, text: 'ABOUTSTATSEXPERIENCE', value$: new BehaviorSubject<number>(0) },
      { icon: 'fas fa-star', target: 4.9, text: 'ABOUTSTATSRATING', value$: new BehaviorSubject<number>(0) },
    ];
  }

  ngAfterViewInit(): void {

    // ❌ ممنوع أي DOM على السيرفر
    if (!this.isBrowser) return;

    const section = this.statsSection?.nativeElement;
    if (!section) return;

    // ✔️ حماية إضافية
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.counted) {
          this.startCounting();
          this.counted = true;
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(section);
  }

  private startCounting(): void {
    const duration = 3500;
    const steps = 150;
    const stepTime = duration / steps;

    this.stats.forEach(stat => {
      const increment = stat.target / steps;

      interval(stepTime).pipe(
        take(steps + 1),
        map(i =>
          +(
            Math.min(i * increment, stat.target)
          ).toFixed(stat.target % 1 === 0 ? 0 : 1)
        )
      ).subscribe(val => stat.value$.next(val));
    });
  }
}