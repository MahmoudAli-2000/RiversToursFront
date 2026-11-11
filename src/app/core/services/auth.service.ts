import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, retry, tap } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

private readonly httpClient=inject(HttpClient);


   Register(data:object){
    return this.httpClient.post(`${environment.BaseUrl}/api/Account/register`,data);
   }

   Login(data:object){
    return this.httpClient.post(`${environment.BaseUrl}/api/Account/login`,data, {
      withCredentials: true
    });
   }
  
   LogOut() {
    // إرسال طلب logout للـ backend لو حابب تمسح الـ cookie
    return this.httpClient.post(`${environment.BaseUrl}/api/Account/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        // مسح حالة login من الفرونت
        localStorage.removeItem('isLoggedIn');
      })
    );
  }
  

  checkAuth(): Observable<boolean> {
    return this.httpClient.get(
      `${environment.BaseUrl}/api/Account/check-auth`,
      {
        withCredentials: true,
        headers: {
          'X-Skip-Auth': 'true'
        }
      }
    ).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
  
  }
