import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { NotfoundComponent } from './notfound.component';

describe('NotfoundComponent', () => {
  let component: NotfoundComponent;
  let fixture: ComponentFixture<NotfoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotfoundComponent],
      providers: [provideRouter([{ path: 'home', component: NotfoundComponent }])]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotfoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate home when the back button is clicked', async () => {
    const router = TestBed.inject(Router);

    fixture.nativeElement.querySelector('.btn-back').click();
    await fixture.whenStable();

    expect(router.url).toBe('/home');
  });
});
