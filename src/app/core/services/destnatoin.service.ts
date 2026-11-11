import { environment } from './../environments/environments';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DestnatoinService {

  private readonly httpClient=inject(HttpClient);

  getAllDestnation():Observable<any>{
      return this.httpClient.get(`${environment.BaseUrl}/api/Destination/client`);
    }
    getAllAdminDestnation():Observable<any>{
      return this.httpClient.get(`${environment.BaseUrl}/api/Destination/admin`);
    }

    getDetaildedDestantion(id:number|null):Observable<any>{
      return this.httpClient.get(`${environment.BaseUrl}/api/Destination/${id}`);
    }

    createDestantion(data:FormData):Observable<any>{
      return this.httpClient.post(`${environment.BaseUrl}/api/Destination/create`,data);
    }
    updateDestantion(id:number,data:FormData):Observable<any>{
      return this.httpClient.put(`${environment.BaseUrl}/api/Destination/update/${id}`,data);
    }
    
    delteDestantion(id:number):Observable<any>{
      return this.httpClient.delete(`${environment.BaseUrl}/api/Destination/delete/${id}`);
    }

  }
