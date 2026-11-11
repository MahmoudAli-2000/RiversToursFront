import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesntationDetailComponent } from './desntation-detail.component';

describe('DesntationDetailComponent', () => {
  let component: DesntationDetailComponent;
  let fixture: ComponentFixture<DesntationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesntationDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesntationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
