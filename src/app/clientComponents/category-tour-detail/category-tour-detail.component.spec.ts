import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryTourDetailComponent } from './category-tour-detail.component';

describe('CategoryTourDetailComponent', () => {
  let component: CategoryTourDetailComponent;
  let fixture: ComponentFixture<CategoryTourDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryTourDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryTourDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
