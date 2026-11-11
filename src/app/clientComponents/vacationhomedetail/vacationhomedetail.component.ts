import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, Meta, SafeResourceUrl, Title } from '@angular/platform-browser';
import { takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { IVacationHomeDetail } from '../../core/interfaces/ivacationhome';
import { IEmailHomeBooking } from '../../core/interfaces/iemail';
import { EmailService } from '../../core/services/email.service';
import { ReloadService } from '../../core/services/reload.service';
import { TranslationService } from '../../core/services/translation.service';
import { VacationHomeService } from '../../core/services/vacationhome.service';
import { ReloadableComponent } from '../reloadable/reloadable.component';
import { TranslatedPipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-vacationhomedetail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslatedPipe],
  templateUrl: './vacationhomedetail.component.html',
  styleUrl: './vacationhomedetail.component.css'
})
export class VacationhomedetailComponent extends ReloadableComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly vacationHomeService = inject(VacationHomeService);
  private readonly emailService = inject(EmailService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly toaster = inject(ToastrService);
  private readonly translations = inject(TranslationService);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private autoplayTimer?: ReturnType<typeof setInterval>;

  readonly home = signal<IVacationHomeDetail | null>(null);
  readonly loading = signal(true);
  readonly loadError = signal(false);
  readonly selectedImageIndex = signal(0);
  readonly submitting = signal(false);
  readonly googleMapsLink = computed(() => {
    const url = this.parseGoogleMapsUrl(this.home()?.googleMapsUrl);
    if (!url) return null;

    if (url.pathname.includes('/maps/embed')) {
      const coordinates = url.href.match(/!2d(-?\d+(?:\.\d+)?)!3d(-?\d+(?:\.\d+)?)/);
      const location = url.searchParams.get('q')
        || url.searchParams.get('query')
        || (coordinates ? `${coordinates[2]},${coordinates[1]}` : null);

      if (location) {
        const mapsLink = new URL('https://www.google.com/maps/search/');
        mapsLink.searchParams.set('api', '1');
        mapsLink.searchParams.set('query', location);
        return mapsLink.toString();
      }

      url.pathname = '/maps';
    }

    return url.toString();
  });
  readonly mapEmbedUrl = computed<SafeResourceUrl | null>(() => {
    const sourceUrl = this.parseGoogleMapsUrl(this.home()?.googleMapsUrl);
    if (!sourceUrl) return null;

    try {
      const url = new URL(sourceUrl.toString());
      if (url.pathname.includes('/maps/embed')) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url.toString());
      }

      const place = url.pathname.match(/\/maps\/(?:place|search)\/([^/]+)/)?.[1];
      const coordinates = url.href.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
      const location = url.searchParams.get('q')
        || url.searchParams.get('query')
        || (coordinates ? `${coordinates[1]},${coordinates[2]}` : null)
        || (place ? new URLSearchParams(`place=${place}`).get('place') : null);

      if (!location) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url.toString());
      }

      const embedUrl = new URL('https://maps.google.com/maps');
      embedUrl.searchParams.set('q', location);
      embedUrl.searchParams.set('output', 'embed');
      return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl.toString());
    } catch {
      return null;
    }
  });

  private parseGoogleMapsUrl(value: string | null | undefined): URL | null {
    let rawUrl = value?.trim();
    if (!rawUrl) return null;

    const iframeAttributes = rawUrl.match(/<iframe\b([^>]*)>/i)?.[1];
    if (iframeAttributes) {
      const sourceAttribute = iframeAttributes.match(
        /(?:^|\s)src\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i
      );
      rawUrl = (sourceAttribute?.[1] ?? sourceAttribute?.[2] ?? sourceAttribute?.[3])
        ?.replace(/&amp;/gi, '&');
      if (!rawUrl) return null;
    }

    try {
      const url = new URL(rawUrl);
      const hostname = url.hostname.toLowerCase();
      const isGoogleMapsHost =
        hostname === 'maps.app.goo.gl' ||
        hostname === 'goo.gl' ||
        /^(?:(?:www|maps)\.)?google\.(?:com(?:\.[a-z]{2})?|[a-z]{2,3}(?:\.[a-z]{2})?)$/.test(hostname);

      if (!isGoogleMapsHost || !['https:', 'http:'].includes(url.protocol) || url.username || url.password) {
        return null;
      }

      url.protocol = 'https:';
      return url;
    } catch {
      return null;
    }
  }

  readonly bookingForm = this.formBuilder.group({
    FullName: ['', [Validators.required, Validators.minLength(3)]],
    EmailAddress: ['', [Validators.required, Validators.email]],
    Message: ['', Validators.required],
    CheckInTime: ['', Validators.required],
    CheckOutTime: ['', Validators.required],
    FK_VacationHomes: [0, Validators.required]
  });

  constructor(reloadService: ReloadService) {
    super(reloadService);
  }

  ngOnInit(): void {
    this.onReload(() => this.loadData());
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(() => this.loadData());
  }

  override ngOnDestroy(): void {
    this.stopGalleryAutoplay();
    super.ngOnDestroy();
  }

  private loadData(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.loading.set(true);
    this.loadError.set(false);
    this.vacationHomeService.getBySlug(slug, this.translations.lang()).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: home => {
        this.home.set(home);
        this.selectedImageIndex.set(0);
        this.startGalleryAutoplay();
        this.bookingForm.patchValue({ FK_VacationHomes: home.id });
        this.titleService.setTitle(`${this.homeName} | Vacation Homes`);
        this.metaService.updateTag({ name: 'description', content: this.homeDescription });
        this.loading.set(false);
      },
      error: error => {
        console.error('Unable to load vacation home', error);
        this.loadError.set(true);
        this.loading.set(false);
      }
    });
  }

  get homeName(): string {
    const home = this.home();
    const localized = home?.translations?.find(item =>
      item.language.toLowerCase() === this.translations.lang().toLowerCase()
    );
    return localized?.name || home?.name || home?.referneceName || 'Vacation home';
  }

  get homeDescription(): string {
    const home = this.home();
    const localized = home?.translations?.find(item =>
      item.language.toLowerCase() === this.translations.lang().toLowerCase()
    );
    return localized?.description || home?.description || '';
  }

  get galleryImages(): string[] {
    const home = this.home();
    if (!home) return [];
    return [...new Set([
      home.imageCover,
      ...(home.vacationHomesImgs ?? [])
        .filter(image => image.isActive !== false)
        .map(image => image.imageCarouselUrl)
    ].filter((url): url is string => Boolean(url)))];
  }

  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
    this.startGalleryAutoplay();
  }

  private startGalleryAutoplay(): void {
    this.stopGalleryAutoplay();
    if (!this.isBrowser || this.galleryImages.length < 2) return;

    this.autoplayTimer = setInterval(() => {
      this.selectedImageIndex.update(index => (index + 1) % this.galleryImages.length);
    }, 4500);
  }

  private stopGalleryAutoplay(): void {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = undefined;
    }
  }

  submitBooking(): void {
    this.bookingForm.markAllAsTouched();
    if (this.bookingForm.invalid || this.submitting()) return;

    const formValue = this.bookingForm.getRawValue();
    const request: IEmailHomeBooking = {
      FullName: formValue.FullName ?? '',
      EmailAddress: formValue.EmailAddress ?? '',
      Message: formValue.Message ?? '',
      CheckInTime: formValue.CheckInTime ?? '',
      CheckOutTime: formValue.CheckOutTime ?? '',
      FK_VacationHomes: formValue.FK_VacationHomes ?? this.home()?.id ?? 0,
      FullVacationHomes: this.homeName.trim() || this.home()?.referneceName?.trim() || 'Vacation home'
    };
    this.submitting.set(true);
    this.emailService.sendVacationHomeBooking(request).subscribe({
      next: () => {
        this.toaster.success(this.translations.t('STAY.REQUEST_SUCCESS'));
        this.bookingForm.reset({ FK_VacationHomes: this.home()?.id ?? 0 });
        this.submitting.set(false);
      },
      error: error => {
        console.error('Unable to send vacation home booking request', error);
        this.toaster.error(this.translations.t('STAY.REQUEST_ERROR'));
        this.submitting.set(false);
      }
    });
  }
}
