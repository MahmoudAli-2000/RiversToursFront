import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ReloadService } from '../../core/services/reload.service';

@Component({
  selector: 'app-reloadable',
  standalone: true,
  imports: [],
  templateUrl: './reloadable.component.html',
  styleUrl: './reloadable.component.css'
})
export class ReloadableComponent {
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
