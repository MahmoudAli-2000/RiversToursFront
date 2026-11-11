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
    s1.async = true;
    s1.src = 'https://embed.tawk.to/69488d04420bc819787eff99/1jd1mdmlf';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    document.body.appendChild(s1);

    s1.onload = () => {
      const iframe = document.querySelector(
        'iframe[title="chat widget"]'
      ) as HTMLElement | null;

      if (iframe) {
        iframe.style.left = '20px';
        iframe.style.right = 'auto';
      }
    };
  }
}