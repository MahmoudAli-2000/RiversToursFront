import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReloadableComponent } from './reloadable.component';

describe('ReloadableComponent', () => {
  let component: ReloadableComponent;
  let fixture: ComponentFixture<ReloadableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReloadableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReloadableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
