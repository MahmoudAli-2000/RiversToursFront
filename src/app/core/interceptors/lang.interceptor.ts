import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { LanguageService } from '../services/language.service';

export const langInterceptor: HttpInterceptorFn = (req, next) => {
  const langService = inject(LanguageService);
  const lang = langService.currentLang() || 'en'; // استدعاء signal للحصول على القيمة
  if (req.url.includes('/check-auth') || req.url.includes('/login')) {
    return next(req); // 👈 مهم
  }
  // لو الـ request بالفعل يحتوي على باراميتر lang، خليها زي ما هي
  if (req.params.has('lang')) {
    return next(req);
  }
 
  // إضافة باراميتر lang
  const modifiedReq = req.clone({
    params: req.params.set('lang', lang)
  });

  return next(modifiedReq);
};
