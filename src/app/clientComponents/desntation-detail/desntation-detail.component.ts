import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { IdetailedDestnaion } from '../../core/interfaces/idestnation';
import { Subscription } from 'rxjs';
import { DestnatoinService } from '../../core/services/destnatoin.service';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-desntation-detail',
  standalone: true,
  imports: [],
  templateUrl: './desntation-detail.component.html',
  styleUrl: './desntation-detail.component.css'
})
export class DesntationDetailComponent implements OnInit , OnDestroy{


      DetailedCategoryTour:WritableSignal<IdetailedDestnaion|null>=signal(null);
      DestanationSubs:WritableSignal<Subscription|null>=signal(null);
    
    
      private readonly DestantionService=inject(DestnatoinService);
      private readonly activeRouete=inject(ActivatedRoute);
    
    
      ngOnInit(): void {
    
        this.activeRouete.paramMap.subscribe({
          next:(p)=>{
            let  id=Number(p.get('id'));
    
                // Must call API here
                this.DestanationSubs.set( this.DestantionService.getDetaildedDestantion(id).subscribe({
                next:(res)=>{
                 
                  console.log(res);
                  this.DetailedCategoryTour.set(res);
                },
                error:(err:HttpErrorResponse)=>{
                  console.log(err.message);
                }
              }));
            
          }
        });
        
      }
    
      ngOnDestroy(): void {
        if(this.DestanationSubs()){
          this.DestanationSubs()?.unsubscribe();
        }
      }
    

}
