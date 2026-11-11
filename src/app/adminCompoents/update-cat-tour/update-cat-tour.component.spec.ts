import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCatTourComponent } from './update-cat-tour.component';

describe('UpdateCatTourComponent', () => {
  let component: UpdateCatTourComponent;
  let fixture: ComponentFixture<UpdateCatTourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCatTourComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateCatTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
