import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { environment } from '../environments/environments';
import { authInterceptorInterceptor } from './auth-interceptor.interceptor';

describe('authInterceptorInterceptor', () => {
  let http: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptorInterceptor])),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    });
  });

  afterEach(() => httpTestingController.verify());

  it('routes browser API requests through the same-origin proxy', () => {
    http = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);

    http.get(`${environment.BaseUrl}/api/Account/check-auth`).subscribe();

    const request = httpTestingController.expectOne('/api/Account/check-auth');
    request.flush({});
  });

  it('keeps API URLs absolute during server-side rendering', () => {
    TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });
    http = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);

    http.get(`${environment.BaseUrl}/api/Account/check-auth`).subscribe();

    const request = httpTestingController.expectOne(
      `${environment.BaseUrl}/api/Account/check-auth`
    );
    request.flush({});
  });
});
