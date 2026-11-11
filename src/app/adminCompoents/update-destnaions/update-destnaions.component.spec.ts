import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDestnaionsComponent } from './update-destnaions.component';

describe('UpdateDestnaionsComponent', () => {
  let component: UpdateDestnaionsComponent;
  let fixture: ComponentFixture<UpdateDestnaionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateDestnaionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateDestnaionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
