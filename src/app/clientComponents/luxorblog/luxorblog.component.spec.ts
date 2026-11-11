import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuxorblogComponent } from './luxorblog.component';

describe('LuxorblogComponent', () => {
  let component: LuxorblogComponent;
  let fixture: ComponentFixture<LuxorblogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxorblogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LuxorblogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
