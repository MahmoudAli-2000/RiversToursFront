import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestnationAdComponent } from './destnation-ad.component';

describe('DestnationAdComponent', () => {
  let component: DestnationAdComponent;
  let fixture: ComponentFixture<DestnationAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestnationAdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DestnationAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
