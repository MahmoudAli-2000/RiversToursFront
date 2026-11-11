import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { IEmailHome } from '../../core/interfaces/iemail';
import { SearchemailPipe } from '../../core/pipes/searchemail.pipe';
import { EmailService } from '../../core/services/email.service';
import { VacationHomeService } from '../../core/services/vacationhome.service';

@Component({
  selector: 'app-vacationhome-email-ad',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, SearchemailPipe],
  templateUrl: './vacationhome-email-ad.component.html',
  styleUrl: '../email-ad/email-ad.component.css'
})
export class VacationhomeEmailAdComponent implements OnInit, OnDestroy {
  private readonly emailService = inject(EmailService);
  private readonly vacationHomeService = inject(VacationHomeService);
  private request?: Subscription;
  private detailsRequest?: Subscription;

  readonly emailList = signal<IEmailHome[]>([]);
  readonly selectedEmail = signal<IEmailHome | null>(null);
  searchTerm = '';
  pageIndex = 1;
  readonly pageSize = 10;
  totalCount = 0;

  ngOnInit(): void {
    this.loadEmails();
  }

  ngOnDestroy(): void {
    this.request?.unsubscribe();
    this.detailsRequest?.unsubscribe();
  }

  get totalPages(): number[] {
    return Array.from({ length: Math.ceil(this.totalCount / this.pageSize) }, (_, index) => index + 1);
  }

  changePage(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages.length || newPage === this.pageIndex) return;
    this.pageIndex = newPage;
    this.loadEmails();
  }

  loadEmails(): void {
    this.request?.unsubscribe();
    this.request = this.emailService.getAllVacationHomeEmails(this.pageIndex, this.pageSize).subscribe({
      next: result => {
        this.emailList.set(result.data);
        this.totalCount = result.count;
      },
      error: error => {
        console.error('Unable to load vacation home booking emails', error);
        void Swal.fire('Error!', 'Vacation home booking emails could not be loaded.', 'error');
      }
    });
  }

  openEmail(email: IEmailHome): void {
    this.selectedEmail.set(email);
    this.detailsRequest?.unsubscribe();

    if (email.fullVacationHomes?.trim() || email.fK_VacationHomes == null) return;

    this.detailsRequest = this.vacationHomeService.getForUpdate(email.fK_VacationHomes).subscribe({
      next: home => {
        if (this.selectedEmail()?.id !== email.id) return;
        const homeName = home.translations.find(translation => translation.name?.trim())?.name.trim()
          || home.referneceName;
        if (homeName) {
          this.selectedEmail.update(selected =>
            selected?.id === email.id ? { ...selected, fullVacationHomes: homeName } : selected
          );
        }
      },
      error: error => {
        console.error('Unable to load vacation home name for booking email', error);
        void Swal.fire('Error!', 'The vacation home name could not be loaded.', 'error');
      }
    });
  }

  removeEmail(email: IEmailHome): void {
    void Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (!result.isConfirmed) return;

      this.emailService.deleteVacationHomeEmailById(email.id).subscribe({
        next: () => {
          void Swal.fire('Deleted!', 'Vacation home booking email has been deleted.', 'success');
          this.selectedEmail.set(null);
          this.totalCount--;
          if (this.emailList().length === 1 && this.pageIndex > 1) {
            this.pageIndex--;
            this.loadEmails();
          } else {
            this.emailList.update(emails => emails.filter(item => item.id !== email.id));
          }
        },
        error: error => {
          console.error('Unable to delete vacation home booking email', error);
          void Swal.fire('Error!', 'There was a problem deleting the booking email.', 'error');
        }
      });
    });
  }
}
