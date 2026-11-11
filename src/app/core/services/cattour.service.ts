import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CattourService {

private readonly httpClient=inject(HttpClient);

    getAllCAtegorytours():Observable<any>{
      return this.httpClient.get(`${environment.BaseUrl}/api/CategorTour/client`);
    }

    getAllAdminCAtegorytours():Observable<any>{
      return this.httpClient.get(`${environment.BaseUrl}/api/CategorTour/admin`);
    }

    getDetaildedCategorTour(slug:string |null):Observable<any>{
      return this.httpClient.get(`${environment.BaseUrl}/api/CategorTour/by-slug/${slug}`);
    }

    createCatTour(data:FormData):Observable<any>{
      return this.httpClient.post(`${environment.BaseUrl}/api/CategorTour/create`,data);
    }
    updateCatTour(id:number,data:FormData):Observable<any>{
      return this.httpClient.put(`${environment.BaseUrl}/api/CategorTour/update/${id}`,data);
    }
    
    getAllDetaildedCategoryTour(id:number|null):Observable<any>{
      return this.httpClient.get(`${environment.BaseUrl}/api/CategorTour/get-CatgeroyTour-for-update/${id}`);
    }

    deleteCatTour(id:number):Observable<any>{
      return this.httpClient.delete(`${environment.BaseUrl}/api/CategorTour/delete/${id}`);
    }
  }
