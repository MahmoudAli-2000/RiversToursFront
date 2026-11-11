import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDestnaionsComponent } from './create-destnaions.component';

describe('CreateDestnaionsComponent', () => {
  let component: CreateDestnaionsComponent;
  let fixture: ComponentFixture<CreateDestnaionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDestnaionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateDestnaionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
