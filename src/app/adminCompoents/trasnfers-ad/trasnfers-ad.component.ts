import { Component, inject, signal, WritableSignal } from '@angular/core';
import { TransferService } from '../../core/services/transfer.service';
import { Itransfer } from '../../core/interfaces/itransfer';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from "@angular/router";
import Swal from 'sweetalert2';


@Component({
  selector: 'app-trasnfers-ad',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './trasnfers-ad.component.html',
  styleUrl: './trasnfers-ad.component.css'
})
export class TrasnfersAdComponent {
private readonly TransferService=inject(TransferService);
  
    // AllTrasnferList:Itransfer[]=[];
    AllTrasnferList:WritableSignal<Itransfer[]>=signal([]);
    TrasnferSUbs:WritableSignal<Subscription|null>=signal(null);

    ngOnInit(): void {
      this.TrasnferSUbs.set( this.TransferService.getAllAdminTransfers().subscribe({
          next:(res)=>{
            this.AllTrasnferList.set(res.data);
          },
          error:(err:HttpErrorResponse)=>{
            console.log(err.message);
          }
        }));

        
      }
    
      ngOnDestroy(): void {
        if(this.TrasnferSUbs()){
          this.TrasnferSUbs()?.unsubscribe();
        }
      }


      deleteTransfer(id: number) {
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
                this.TransferService.deleteTransfer(id).subscribe({
                  next: () => {
                    Swal.fire(
                      'Deleted!',
                      'Destination has been deleted.',
                      'success'
                    );
                    // لو عندك جدول أو قائمة رحلات، اعمل تحديث للقائمة
                    this.AllTrasnferList.set(this.AllTrasnferList().filter(d=>d.id!=id)); // مثال
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
