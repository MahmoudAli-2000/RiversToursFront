import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { IVacationHome } from '../../core/interfaces/ivacationhome';
import { IPagedVacationHomes, VacationHomeService } from '../../core/services/vacationhome.service';

@Component({
  selector: 'app-vacationhomes-ad',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, RouterLink],
  templateUrl: './vacationhomes-ad.component.html',
  styleUrl: '../tours-ad/tours-ad.component.css'
})
export class VacationhomesAdComponent implements OnInit {
  private readonly vacationHomeService = inject(VacationHomeService);

  readonly homes = signal<IVacationHome[]>([]);
  readonly loading = signal(true);
  searchTerm = '';
  pageIndex = 1;
  readonly pageSize = 10;
  totalCount = 0;

  ngOnInit(): void {
    this.loadHomes();
  }

  get filteredHomes(): IVacationHome[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.homes();
    return this.homes().filter(home =>
      [home.referneceName, home.name, home.city, home.area, home.destinationName]
        .some(value => value?.toLowerCase().includes(term))
    );
  }

  get totalPages(): number[] {
    return Array.from({ length: Math.ceil(this.totalCount / this.pageSize) }, (_, index) => index + 1);
  }

  loadHomes(): void {
    this.loading.set(true);
    this.vacationHomeService.getAdminHomes(this.pageIndex, this.pageSize).subscribe({
      next: response => {
        if (Array.isArray(response)) {
          this.homes.set(response);
          this.totalCount = response.length;
        } else {
          const pagedResponse = response as IPagedVacationHomes;
          this.homes.set(pagedResponse.data ?? []);
          this.totalCount = pagedResponse.count ?? pagedResponse.data?.length ?? 0;
        }
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Unable to load vacation homes for administration', error);
        this.loading.set(false);
        Swal.fire('Error', 'Unable to load vacation homes.', 'error');
      }
    });
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages.length || page === this.pageIndex) return;
    this.pageIndex = page;
    this.loadHomes();
  }

  async deleteHome(home: IVacationHome): Promise<void> {
    const result = await Swal.fire({
      title: 'Delete this vacation home?',
      text: `“${home.referneceName}” will be permanently removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#b84235'
    });
    if (!result.isConfirmed) return;

    this.vacationHomeService.delete(home.id).subscribe({
      next: () => {
        Swal.fire('Deleted', 'Vacation home deleted successfully.', 'success');
        if (this.homes().length === 1 && this.pageIndex > 1) this.pageIndex--;
        this.loadHomes();
      },
      error: error => {
        console.error('Unable to delete vacation home', error);
        Swal.fire('Error', 'Vacation home could not be deleted.', 'error');
      }
    });
  }
}
