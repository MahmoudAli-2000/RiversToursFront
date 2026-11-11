import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { VacationHomeService } from '../../core/services/vacationhome.service';
import { VacationhomeComponent } from './vacationhome.component';

describe('VacationhomeComponent', () => {
  let component: VacationhomeComponent;
  let fixture: ComponentFixture<VacationhomeComponent>;
  const vacationHomeService = jasmine.createSpyObj<VacationHomeService>('VacationHomeService', ['getClientHomes']);

  beforeEach(async () => {
    vacationHomeService.getClientHomes.and.returnValue(of([]));
    await TestBed.configureTestingModule({
      imports: [VacationhomeComponent],
      providers: [
        provideRouter([]),
        { provide: VacationHomeService, useValue: vacationHomeService }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VacationhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
