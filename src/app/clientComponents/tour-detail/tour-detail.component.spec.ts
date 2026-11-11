import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TOurDetailComponent } from './tour-detail.component';

describe('TOurDetailComponent', () => {
  let component: TOurDetailComponent;
  let fixture: ComponentFixture<TOurDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TOurDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TOurDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
