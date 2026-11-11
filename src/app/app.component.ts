import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TourSiteClient';
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    
     if (isPlatformBrowser(this.platformId)) {
      this.router.events
        .pipe(
          filter((event): event is NavigationEnd => event instanceof NavigationEnd)
        )
        .subscribe((event) => {
    
          // Facebook Pixel
          const fbq = (window as any)['fbq'];
          if (typeof fbq === 'function') {
            fbq('track', 'PageView');
          }
    
          // Google Ads / Analytics
          const gtag = (window as any)['gtag'];
          if (typeof gtag === 'function') {
            gtag('config', 'AW-17847385347', {
              page_path: event.urlAfterRedirects
            });
          }
    
        });
    }
    

  
  }

}
