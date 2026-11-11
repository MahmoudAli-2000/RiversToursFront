import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IVacationHome } from '../../core/interfaces/ivacationhome';
import { IPagedVacationHomes, VacationHomeService } from '../../core/services/vacationhome.service';
import { ReloadService } from '../../core/services/reload.service';
import { ReloadableComponent } from '../reloadable/reloadable.component';
import { LanguageService } from '../../core/services/language.service';
import { TranslatedPipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-vacationhome',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatedPipe],
  templateUrl: './vacationhome.component.html',
  styleUrl: './vacationhome.component.css'
})
export class VacationhomeComponent extends ReloadableComponent implements OnInit {
  private readonly vacationHomeService = inject(VacationHomeService);
  private readonly languageService = inject(LanguageService);

  readonly homes = signal<IVacationHome[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  pageIndex = 1;
  readonly pageSize = 12;
  totalCount = 0;

  constructor(reloadService: ReloadService) {
    super(reloadService);
  }

  ngOnInit(): void {
    this.loadHomes();
    this.onReload(() => this.loadHomes());
  }

  get totalPages(): number[] {
    return Array.from({ length: Math.ceil(this.totalCount / this.pageSize) }, (_, index) => index + 1);
  }

  loadHomes(): void {
    this.loading.set(true);
    this.error.set(false);
    this.vacationHomeService.getClientHomes(this.pageIndex, this.pageSize).subscribe({
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
      error: error => {
        console.error('Unable to load vacation homes', error);
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages.length || page === this.pageIndex) return;
    this.pageIndex = page;
    this.loadHomes();
  }

  homeLink(home: IVacationHome): string {
    return home.slug || String(home.id);
  }

  homeName(home: IVacationHome): string {
    return home.translations?.find(item =>
      item.language.toLowerCase() === this.languageService.currentLangValue
    )?.name || home.name || home.referneceName;
  }

  homeDescription(home: IVacationHome): string {
    return home.translations?.find(item =>
      item.language.toLowerCase() === this.languageService.currentLangValue
    )?.description || home.description || home.address;
  }
}
