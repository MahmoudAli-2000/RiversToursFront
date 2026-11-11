import { DestnatoinService } from './../../core/services/destnatoin.service';
import { Subscription } from 'rxjs';
import { IDestnation } from '../../core/interfaces/idestnation';
import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { sign } from 'crypto';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-destnations',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './destnations.component.html',
  styleUrl: './destnations.component.css'
})
export class DestnationsComponent implements OnInit , OnDestroy{ 

  private readonly DestnatoinService=inject(DestnatoinService);

  allDestionList:WritableSignal<IDestnation[]>=signal([]);
  destnationSUbs:WritableSignal<Subscription|null>=signal(null);


  ngOnInit(): void {
    this.destnationSUbs.set(this.DestnatoinService.getAllDestnation().subscribe({
        next:(res)=>{
          this.allDestionList.set(res.data);
          console.log(this.allDestionList());
        },
        error:(err:HttpErrorResponse)=>{
          console.log(err.message);
        }
      }));
    }
  
    ngOnDestroy(): void {
      if(this.destnationSUbs()){
        this.destnationSUbs()?.unsubscribe();
      }
    }
  




}
