import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { IEmailHomeBooking } from '../../core/interfaces/iemail';
import { EmailService } from '../../core/services/email.service';
import { TranslationService } from '../../core/services/translation.service';
import { VacationHomeService } from '../../core/services/vacationhome.service';
import { VacationhomedetailComponent } from './vacationhomedetail.component';

describe('VacationhomedetailComponent', () => {
  let component: VacationhomedetailComponent;
  let fixture: ComponentFixture<VacationhomedetailComponent>;
  const vacationHomeService = jasmine.createSpyObj<VacationHomeService>('VacationHomeService', ['getBySlug']);
  const emailService = jasmine.createSpyObj<EmailService>('EmailService', ['sendVacationHomeBooking']);

  beforeEach(async () => {
    emailService.sendVacationHomeBooking.and.returnValue(of({ message: 'sent' }));
    vacationHomeService.getBySlug.and.returnValue(of({
      id: 1,
      referneceName: 'Test home',
      imageCover: 'cover.jpg',
      slug: 'test-home',
      propertyType: 1,
      createdAt: '',
      city: 'Hurghada',
      area: '',
      address: '',
      googleMapsUrl: null,
      latitude: null,
      longitude: null,
      isActive: true,
      priceDollar: 100,
      priceEuro: 90,
      fK_DestinationID: null,
      destinationName: '',
      name: 'Test home',
      description: 'A test stay',
      vacationHomesImgs: [],
      translations: []
    }));
    await TestBed.configureTestingModule({
      imports: [VacationhomedetailComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ slug: 'test-home' })) } },
        { provide: VacationHomeService, useValue: vacationHomeService },
        { provide: EmailService, useValue: emailService },
        { provide: ToastrService, useValue: jasmine.createSpyObj('ToastrService', ['success', 'error']) },
        { provide: TranslationService, useValue: { lang: signal('en'), t: (key: string) => key } },
        { provide: Title, useValue: jasmine.createSpyObj('Title', ['setTitle']) },
        { provide: Meta, useValue: jasmine.createSpyObj('Meta', ['updateTag']) }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VacationhomedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows an interactive map for a Google Maps location URL', () => {
    const home = component.home();
    expect(home).not.toBeNull();

    component.home.set({ ...home!, googleMapsUrl: 'https://www.google.com/maps?q=Hurghada' });
    fixture.detectChanges();

    const mapFrame: HTMLIFrameElement | null = fixture.nativeElement.querySelector('.detail-map iframe');
    expect(mapFrame).toBeTruthy();
    expect(mapFrame?.getAttribute('src')).toContain('maps.google.com/maps');
    expect(mapFrame?.getAttribute('src')).toContain('q=Hurghada');
    expect(mapFrame?.getAttribute('src')).toContain('output=embed');
  });

  it('extracts and displays the map from a complete Google Maps iframe snippet', () => {
    const home = component.home();
    expect(home).not.toBeNull();
    const embedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12986.5!2d33.8076!3d27.2562';

    component.home.set({
      ...home!,
      googleMapsUrl: `<iframe src="${embedUrl}" width="600" height="450" style="border:0;" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>`
    });
    fixture.detectChanges();

    const mapFrame: HTMLIFrameElement | null = fixture.nativeElement.querySelector('.detail-map iframe');
    const mapLink: HTMLAnchorElement | null = fixture.nativeElement.querySelector('.detail-map-link');
    expect(mapFrame?.getAttribute('src')).toBe(embedUrl);
    expect(mapLink?.getAttribute('href')).toContain('https://www.google.com/maps/search/');
    expect(mapLink?.getAttribute('href')).toContain('api=1');
    expect(mapLink?.getAttribute('href')).toContain('query=27.2562%2C33.8076');
  });

  it('does not embed map URLs from untrusted hosts', () => {
    const home = component.home();
    expect(home).not.toBeNull();

    component.home.set({ ...home!, googleMapsUrl: 'https://example.com/maps?q=Hurghada' });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.detail-map iframe')).toBeNull();
  });

  it('sends the vacation home name in the backend-required FullVacationHomes field', () => {
    component.bookingForm.patchValue({
      FullName: 'Test Guest',
      EmailAddress: 'guest@example.com',
      Message: 'Interested in these dates',
      CheckInTime: '2026-12-01',
      CheckOutTime: '2026-12-05'
    });

    component.submitBooking();

    expect(emailService.sendVacationHomeBooking).toHaveBeenCalledWith(
      jasmine.objectContaining<IEmailHomeBooking>({
        FK_VacationHomes: 1,
        FullVacationHomes: 'Test home'
      })
    );
  });
});
