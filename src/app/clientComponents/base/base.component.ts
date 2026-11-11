import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ReloadService } from '../../core/services/reload.service';

@Component({
  selector: 'app-base',
  standalone: true,
  imports: [],
  templateUrl: './base.component.html',
  styleUrl: './base.component.css'
})
export class BaseComponent implements OnDestroy{
  protected destroy$ = new Subject<void>();

  constructor(protected reloadService: ReloadService) {}

  protected onReload(cb: () => void) {
    this.reloadService.reload$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cb);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}