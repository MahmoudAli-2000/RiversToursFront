import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailAdComponent } from './email-ad.component';

describe('EmailAdComponent', () => {
  let component: EmailAdComponent;
  let fixture: ComponentFixture<EmailAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailAdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
