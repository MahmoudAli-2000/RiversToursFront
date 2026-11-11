import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class HotelServiceService {

  private httpcleint=inject(HttpClient);

  getAllHotels():Observable<any>{
    return this.httpcleint.get(`${environment.BaseUrl}/api/Hotel/client`);
  }

  getAllAdminHotels():Observable<any>{
    return this.httpcleint.get(`${environment.BaseUrl}/api/Hotel/admin`);
  }
}
