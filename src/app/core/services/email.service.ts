import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { Observable } from 'rxjs';
import { IEmailHome, IEmailHomeBooking, IPagedResult } from '../interfaces/iemail';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private readonly httpClient=inject(HttpClient);


   getAllBookingEmails(pageIndex: number, pageSize: number): Observable<any> {
    const params = {
      pageIndex: pageIndex,
      pageSize: pageSize
    };
  
    return this.httpClient.get(`${environment.BaseUrl}/api/Email`, { params });
  }

   getAllVacationHomeEmails(pageIndex: number, pageSize: number): Observable<IPagedResult<IEmailHome>> {
    const params = { pageIndex, pageSize };
    return this.httpClient.get<IPagedResult<IEmailHome>>(`${environment.BaseUrl}/api/EmailHome`, { params });
   }

    getEmailById(id:number):Observable<any>{
      return this.httpClient.get(`${environment.BaseUrl}/api/Email/${id}`);
    }

   sendEmail(data:object){
    return this.httpClient.post(`${environment.BaseUrl}/api/Email/sendemail`,data);
   }

   sendVacationHomeBooking(data: IEmailHomeBooking): Observable<{ message: string }> {
    return this.httpClient.post<{ message: string }>(`${environment.BaseUrl}/api/EmailHome/sendemail`, data);
   }

   DeleterEmailById(id:number):Observable<any>{
    return this.httpClient.delete(`${environment.BaseUrl}/api/Email/delete/${id}`);
  }

   deleteVacationHomeEmailById(id: number): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(`${environment.BaseUrl}/api/EmailHome/delete/${id}`);
   }
   
   


}
