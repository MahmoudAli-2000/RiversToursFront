import { environment } from './../environments/environments';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

   private httpcleint=inject(HttpClient);
  
    getAllTransfers():Observable<any>{
      return this.httpcleint.get(`${environment.BaseUrl}/api/Transfer/client`);
    }
    getAllAdminTransfers():Observable<any>{
      return this.httpcleint.get(`${environment.BaseUrl}/api/Transfer/admin`);
    }
    getDetaildedTransfers(slug:string|null):Observable<any>{
      return this.httpcleint.get(`${environment.BaseUrl}/api/Transfer/by-slug/${slug}`);
    }

    getAllDetaildedTransfers(id:number|null):Observable<any>{
      return this.httpcleint.get(`${environment.BaseUrl}/api/Transfer/get-transfer-for-update/${id}`);
    }

    createTransfer(data:FormData):Observable<any>{
      return this.httpcleint.post(`${environment.BaseUrl}/api/Transfer/create`,data);
    }
    updateTransfer(id:number,data:FormData):Observable<any>{
      return this.httpcleint.put(`${environment.BaseUrl}/api/Transfer/update/${id}`,data);
    }
    
    deleteTransfer(id:number):Observable<any>{
      return this.httpcleint.delete(`${environment.BaseUrl}/api/Transfer/delete/${id}`);
    }

}
