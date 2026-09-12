import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profil } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProfilService {
  private apiUrl = `${environment.apiUrl}/profiles`;

  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<Profil> {
    return this.http.get<Profil>(`${this.apiUrl}/me`);
  }

  createMyProfile(data: Partial<Profil>): Observable<Profil> {
    return this.http.post<Profil>(`${this.apiUrl}/me`, data);
  }

  updateMyProfile(data: Partial<Profil>): Observable<Profil> {
    return this.http.put<Profil>(`${this.apiUrl}/me`, data);
  }

  deleteMyProfile(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/me`);
  }
}
