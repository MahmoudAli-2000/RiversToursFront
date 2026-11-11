import { Pipe, PipeTransform, ChangeDetectorRef, OnDestroy, EffectRef, effect } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Pipe({
  name: 't',
  standalone: true,
  pure: false
})
export class TranslatedPipe implements PipeTransform, OnDestroy {

  private effectRef?: EffectRef;

  constructor(
    private ts: TranslationService,
    private cdr: ChangeDetectorRef
  ) {
    // تتبع تغييرات اللغة وإجبار التحديث
    this.effectRef = effect(() => {
      // قراءة الـ signal لإجبار التتبع
      this.ts.lang();
      // إجبار Angular على تحديث العرض
      this.cdr.markForCheck();
    });
  }

  transform(key: string): string {
    // قراءة الـ signal مباشرة لضمان التتبع
    this.ts.lang();
    return this.ts.t(key);
  }

  ngOnDestroy(): void {
    if (this.effectRef) {
      this.effectRef.destroy();
    }
  }
}
