import { Component, inject, signal, WritableSignal } from '@angular/core';
import { IEmail } from '../../core/interfaces/iemail';
import { Subscription } from 'rxjs';
import { EmailService } from '../../core/services/email.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import bootstrap from '../../../main.server';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { SearchemailPipe } from '../../core/pipes/searchemail.pipe';


@Component({
  selector: 'app-email-ad',
  standalone: true,
  imports: [DatePipe,CommonModule,SearchemailPipe,FormsModule],
  templateUrl: './email-ad.component.html',
  styleUrl: './email-ad.component.css'
})
export class EmailAdComponent {
    
    searchTerm:string='';
    AllemailList:WritableSignal<IEmail[]>=signal([]);
    EmailSUbs:WritableSignal<Subscription|null>=signal(null);
    selectedEmail = signal<IEmail | null>(null);
    private readonly emailService=inject(EmailService);


    pageIndex = 1;
    pageSize = 10;
    totalCount = 0;
    
    changePage(newPage: number) {
      if (newPage < 1 || newPage > Math.ceil(this.totalCount / this.pageSize)) return;
    
      this.pageIndex = newPage;
      this.loadEmails();
    }
    
    ngOnInit(): void {
     
    this.loadEmails();
        
      }
    
      loadEmails() {
        this.EmailSUbs.set(
          this.emailService.getAllBookingEmails(this.pageIndex, this.pageSize).subscribe({
            next: (res) => {
              this.AllemailList.set(res.data);
              this.totalCount = res.count;  // أهم نقطة
            },
            error: (err) => console.log(err)
          })
        );
      }
      get totalPages(): number[] {
        const total = Math.ceil(this.totalCount / this.pageSize);
        return Array.from({ length: total }, (_, i) => i + 1);
      }   


      ngOnDestroy(): void {
        if(this.EmailSUbs()){
          this.EmailSUbs()?.unsubscribe();
        }
      }
      openPanel(email: any) {
        this.selectedEmail.set(email);
      }
      
      closePanel() {
        this.selectedEmail.set(null);
      }


       
        removeEmail(id: number) {
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
                 this.emailService.DeleterEmailById(id).subscribe({
                   next: () => {
                     Swal.fire(
                       'Deleted!',
                       'Destination has been deleted.',
                       'success'
                     );
                     // لو عندك جدول أو قائمة رحلات، اعمل تحديث للقائمة
                     this.AllemailList.set(this.AllemailList().filter(d=>d.id!=id)); // مثال
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
