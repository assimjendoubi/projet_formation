import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Competence } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CompetenceService {
  private apiUrl = `${environment.apiUrl}/competencies`;

  constructor(private http: HttpClient) {}

  getMyCompetences(): Observable<Competence[]> {
    return this.http.get<Competence[]>(`${this.apiUrl}/me`);
  }

  addCompetence(data: Partial<Competence>): Observable<Competence> {
    return this.http.post<Competence>(this.apiUrl, data);
  }

  updateCompetence(id: number, data: Partial<Competence>): Observable<Competence> {
    return this.http.put<Competence>(`${this.apiUrl}/${id}`, data);
  }

  deleteCompetence(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
