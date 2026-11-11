import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl',
  standalone: true
})
export class SafeUrlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string | null | undefined): SafeResourceUrl {
    if (!url) return '';

    let videoId = '';

    // لو الرابط نوع watch?v=
    if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1];
    }

    // لو الرابط قصير youtu.be
    else if (url.includes('youtu.be')) {
      videoId = url.split('youtu.be/')[1];
    }

    // لو هو embed أصلاً
    else if (url.includes('embed')) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

}
