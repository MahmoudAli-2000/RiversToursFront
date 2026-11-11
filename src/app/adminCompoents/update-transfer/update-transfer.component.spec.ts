import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTransferComponent } from './update-transfer.component';

describe('UpdateTransferComponent', () => {
  let component: UpdateTransferComponent;
  let fixture: ComponentFixture<UpdateTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTransferComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
