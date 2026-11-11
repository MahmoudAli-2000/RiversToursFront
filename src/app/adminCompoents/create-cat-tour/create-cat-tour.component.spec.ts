import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCatTourComponent } from './create-cat-tour.component';

describe('CreateCatTourComponent', () => {
  let component: CreateCatTourComponent;
  let fixture: ComponentFixture<CreateCatTourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCatTourComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateCatTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
