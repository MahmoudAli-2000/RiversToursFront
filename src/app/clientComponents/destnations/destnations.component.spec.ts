import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestnationsComponent } from './destnations.component';

describe('DestnationsComponent', () => {
  let component: DestnationsComponent;
  let fixture: ComponentFixture<DestnationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestnationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DestnationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
