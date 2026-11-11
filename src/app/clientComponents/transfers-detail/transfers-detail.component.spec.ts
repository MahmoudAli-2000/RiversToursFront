import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfersDetailComponent } from './transfers-detail.component';

describe('TransfersDetailComponent', () => {
  let component: TransfersDetailComponent;
  let fixture: ComponentFixture<TransfersDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransfersDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransfersDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
