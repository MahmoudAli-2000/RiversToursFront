import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrasnfersAdComponent } from './trasnfers-ad.component';

describe('TrasnfersAdComponent', () => {
  let component: TrasnfersAdComponent;
  let fixture: ComponentFixture<TrasnfersAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrasnfersAdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrasnfersAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
