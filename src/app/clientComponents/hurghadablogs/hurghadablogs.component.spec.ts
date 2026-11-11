import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HurghadablogsComponent } from './hurghadablogs.component';

describe('HurghadablogsComponent', () => {
  let component: HurghadablogsComponent;
  let fixture: ComponentFixture<HurghadablogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HurghadablogsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HurghadablogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
