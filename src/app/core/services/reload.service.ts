import { effect, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class ReloadService {

  private reloadSubject = new Subject<void>();
  reload$: Observable<void> = this.reloadSubject.asObservable();

  constructor(private langService: LanguageService) {
    // إذا currentLang هو signal
    effect(() => {
      const lang = this.langService.currentLang(); // signal
      this.reloadSubject.next();
    }, { allowSignalWrites: true });
  }
}
