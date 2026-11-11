import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { Subscription } from 'rxjs';
import { TourService } from '../../core/services/tour.service';
import { ITour } from '../../core/interfaces/itour';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from "@angular/router";
import Swal from 'sweetalert2';
import { SearchPipe } from '../../core/pipes/search.pipe';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-tours-ad',
  standalone: true,
  imports: [DatePipe, RouterLink,CommonModule,SearchPipe,FormsModule],
  templateUrl: './tours-ad.component.html',
  styleUrl: './tours-ad.component.css'
})
export class ToursAdComponent implements  OnInit, OnDestroy {
  
    searchTerm:string='';

    private readonly TourService=inject(TourService);
  
    AllToursList:WritableSignal<ITour[]>=signal([]);  
  
    TourSUbs:WritableSignal<Subscription|null>=signal(null);
  
  
    pageIndex = 1;
    pageSize = 10;
    totalCount = 0;
    
    changePage(newPage: number) {
      if (newPage < 1 || newPage > Math.ceil(this.totalCount / this.pageSize)) return;
    
      this.pageIndex = newPage;
      this.loadTours();
    }
    
    
    ngOnInit(): void {
      this.loadTours();
    }
    
    loadTours() {
      this.TourSUbs.set(
        this.TourService.getAllTrueTours(this.pageIndex, this.pageSize).subscribe({
          next: (res) => {
            this.AllToursList.set(res.data);
            this.totalCount = res.count; // مهم لعرض عدد الصفحات
          },
          error: (err: HttpErrorResponse) => console.log(err)
        })
      );
    }
    
    get totalPages(): number[] {
      const total = Math.ceil(this.totalCount / this.pageSize);
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    
      ngOnDestroy(): void {
        if(this.TourSUbs()){
          this.TourSUbs()?.unsubscribe();
        }
      }

  
      
  
     deleteTour(id: number) {
           Swal.fire({
             title: 'Are you sure?',
             text: "You won't be able to revert this!",
             icon: 'warning',
             showCancelButton: true,
             confirmButtonColor: '#DD6B55',
             cancelButtonColor: '#3085d6',
             confirmButtonText: 'Yes, delete it!'
           }).then((result) => {
             if (result.isConfirmed) {
               // هنا نعمل الحذف من API
               this.TourService.deleteTour(id).subscribe({
                 next: () => {
                   Swal.fire(
                     'Deleted!',
                     'Tour has been deleted.',
                     'success'
                   );
                   // لو عندك جدول أو قائمة رحلات، اعمل تحديث للقائمة
                   this.AllToursList.set(this.AllToursList().filter(d=>d.id!=id)); // مثال
                 },
                 error: () => {
                   Swal.fire(
                     'Error!',
                     'There was a problem deleting the tour.',
                     'error'
                   );
                 }
               });
             }
           });
         }
}
