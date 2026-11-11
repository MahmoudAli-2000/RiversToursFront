import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorytourAdComponent } from './categorytour-ad.component';

describe('CategorytourAdComponent', () => {
  let component: CategorytourAdComponent;
  let fixture: ComponentFixture<CategorytourAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorytourAdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategorytourAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
