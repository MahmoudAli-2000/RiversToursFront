import { TranslatedPipe } from './../../core/pipes/translate.pipe';
import { Subscription, takeUntil } from 'rxjs';
import { Itransfer } from '../../core/interfaces/itransfer';
import { TransferService } from './../../core/services/transfer.service';
import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from "@angular/router";
import { TermtextPipe } from '../../core/pipes/termtext.pipe';
import { CommonModule } from '@angular/common';
import { ReloadableComponent } from '../reloadable/reloadable.component';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [RouterLink,TermtextPipe,CommonModule,TranslatedPipe],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.css'
})
export class TransferComponent extends ReloadableComponent  {

   private readonly TransferService=inject(TransferService);
   private readonly seo=inject(SeoService);

    // AllTrasnferList:Itransfer[]=[];
    AllTrasnferList:WritableSignal<Itransfer[]>=signal([]);
    TrasnferSUbs:WritableSignal<Subscription|null>=signal(null);

    ngOnInit(): void {
    this.LoadData();
    this.onReload(() => this.LoadData());
    this.LoadDataSeo();

        
      }

      LoadDataSeo(){
        this.seo.update({
          title: 'Hurghada Airport Transfers & Private Rides | Rivers Tours',
          description: 'Book reliable Hurghada airport transfers and private rides to hotels, resorts and destinations across Egypt with Rivers Tours Travels.',
          keywords: 'Hurghada airport transfer, private transfer Hurghada, Egypt transfer service, hotel transfer Hurghada, Red Sea airport pickup, Rivers Tours Travels',
          canonicalPath: '/transfer',
          imageUrl: '/assets/images/rriver.png'
        });
      };
    LoadData(){
      this.TransferService.getAllTransfers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.AllTrasnferList.set(res.data);
       
        },
        error: (err: HttpErrorResponse) => {
          console.log(err.message);
        }
      });

    };
      // ngOnDestroy(): void {
      //   if(this.TrasnferSUbs()){
      //     this.TrasnferSUbs()?.unsubscribe();
      //   }
      // }

}
