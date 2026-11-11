import { Component, inject, signal, WritableSignal } from '@angular/core';
import { DestnatoinService } from '../../core/services/destnatoin.service';
import { IDestnation } from '../../core/interfaces/idestnation';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from "@angular/router";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-destnation-ad',
  standalone: true,
  imports: [],
  templateUrl: './destnation-ad.component.html',
  styleUrl: './destnation-ad.component.css'
})
export class DestnationAdComponent {
 private readonly DestnatoinService=inject(DestnatoinService);

  allDestionList:WritableSignal<IDestnation[]>=signal([]);
  destnationSUbs:WritableSignal<Subscription|null>=signal(null);


  ngOnInit(): void {
    this.destnationSUbs.set(this.DestnatoinService.getAllAdminDestnation().subscribe({
        next:(res)=>{
          this.allDestionList.set(res.data);
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


    deleteDestination(id: number) {
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
          this.DestnatoinService.delteDestantion(id).subscribe({
            next: () => {
              Swal.fire(
                'Deleted!',
                'Destination has been deleted.',
                'success'
              );
              // لو عندك جدول أو قائمة رحلات، اعمل تحديث للقائمة
              this.allDestionList.set(this.allDestionList().filter(d=>d.id!=id)); // مثال
            },
            error: () => {
              Swal.fire(
                'Error!',
                'There was a problem deleting the destination.',
                'error'
              );
            }
          });
        }
      });
    }
    
}
