import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, PLATFORM_ID } from '@angular/core';
declare global {
  interface Window {
    Tawk_API: any;
    Tawk_LoadStart: any;
  }
}

@Component({
  selector: 'app-tok',
  standalone: true,
  imports: [],
  templateUrl: './tok.component.html',
  styleUrl: './tok.component.css'
})
export class TokComponent  implements AfterViewInit {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  
  ngAfterViewInit(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return; // ⛔ وقف التنفيذ على السيرفر
    }

    (window as any).Tawk_API = (window as any).Tawk_API || {};
    (window as any).Tawk_LoadStart = new Date();

    const s1 = document.createElement('script');
    const s0 = document.getElementsByTagName('script')[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/6af9c0031745c23c3ea0f1b5/1k7fpc3sm';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode?.insertBefore(s1, s0);

    s1.onload = () => {
      const iframe = document.querySelector(
        'iframe[title="chat widget"]'
      ) as HTMLElement | null;

      if (iframe) {
        iframe.style.right = '20px';
        iframe.style.left = 'auto';
      }
    };
  }
}