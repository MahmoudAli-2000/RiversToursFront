// // src/app/translate-loader.ts
// import { HttpClient } from '@angular/common/http';
// import { TranslateLoader, Translation } from '@ngx-translate/core';
// import { Observable } from 'rxjs';
// import { inject } from '@angular/core';

// export class MyTranslateLoader implements TranslateLoader {
//   private http = inject(HttpClient);
//   private prefix = './assets/i18n/';
//   private suffix = '.json';

//   getTranslation(lang: string): Observable<Translation> {
//     return this.http.get<Translation>(`${this.prefix}${lang}${this.suffix}`);
//   }
// }
