import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';
import {
  IVacationHome,
  IVacationHomeDetail,
  IVacationHomeUpdate
} from '../interfaces/ivacationhome';

export interface IPagedVacationHomes {
  data: IVacationHome[];
  count: number;
}

@Injectable({ providedIn: 'root' })
export class VacationHomeService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = `${environment.BaseUrl}/api/VacationHomes`;

  getClientHomes(pageIndex = 1, pageSize = 12): Observable<IPagedVacationHomes | IVacationHome[]> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize);
    return this.httpClient.get<IPagedVacationHomes | IVacationHome[]>(`${this.baseUrl}/client`, { params });
  }

  getAdminHomes(pageIndex = 1, pageSize = 10): Observable<IPagedVacationHomes | IVacationHome[]> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize);
    return this.httpClient.get<IPagedVacationHomes | IVacationHome[]>(`${this.baseUrl}/admin`, { params });
  }

  getBySlug(slug: string, lang: string): Observable<IVacationHomeDetail> {
    const params = new HttpParams().set('lang', lang);
    return this.httpClient.get<IVacationHomeDetail>(
      `${this.baseUrl}/by-slug/${encodeURIComponent(slug)}`,
      { params }
    );
  }

  getForUpdate(id: number): Observable<IVacationHomeUpdate> {
    return this.httpClient.get<IVacationHomeUpdate>(`${this.baseUrl}/get-vacation-homes-for-update/${id}`);
  }

  create(data: FormData): Observable<{ message: string }> {
    return this.httpClient.post<{ message: string }>(`${this.baseUrl}/create`, data);
  }

  update(id: number, data: FormData): Observable<{ message: string }> {
    return this.httpClient.put<{ message: string }>(`${this.baseUrl}/update/${id}`, data);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(`${this.baseUrl}/delete/${id}`);
  }
}
