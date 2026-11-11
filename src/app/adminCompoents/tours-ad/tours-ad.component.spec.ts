import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToursAdComponent } from './tours-ad.component';

describe('ToursAdComponent', () => {
  let component: ToursAdComponent;
  let fixture: ComponentFixture<ToursAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToursAdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToursAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
