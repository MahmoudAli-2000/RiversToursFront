import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokComponent } from './tok.component';

describe('TokComponent', () => {
  let component: TokComponent;
  let fixture: ComponentFixture<TokComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TokComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
