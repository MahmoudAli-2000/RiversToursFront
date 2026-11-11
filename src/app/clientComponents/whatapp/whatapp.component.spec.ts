import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatappComponent } from './whatapp.component';

describe('WhatappComponent', () => {
  let component: WhatappComponent;
  let fixture: ComponentFixture<WhatappComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatappComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WhatappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
