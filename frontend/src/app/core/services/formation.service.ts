import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formation, Category, Chapitre, Page } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FormationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllFormations(params: {
    title?: string; categoryId?: number; level?: string; status?: string;
    page?: number; size?: number; sortBy?: string; sortDir?: string;
  }): Observable<Page<Formation>> {
    let httpParams = new HttpParams();
    if (params.title) httpParams = httpParams.set('title', params.title);
    if (params.categoryId) httpParams = httpParams.set('categoryId', params.categoryId);
    if (params.level) httpParams = httpParams.set('level', params.level);
    if (params.status) httpParams = httpParams.set('status', params.status);
    httpParams = httpParams.set('page', params.page ?? 0);
    httpParams = httpParams.set('size', params.size ?? 9);
    httpParams = httpParams.set('sortBy', params.sortBy ?? 'createdAt');
    httpParams = httpParams.set('sortDir', params.sortDir ?? 'desc');
    return this.http.get<Page<Formation>>(`${this.apiUrl}/formations`, { params: httpParams });
  }

  getFormationById(id: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.apiUrl}/formations/${id}`);
  }

  createFormation(data: any): Observable<Formation> {
    return this.http.post<Formation>(`${this.apiUrl}/formations`, data);
  }

  updateFormation(id: number, data: any): Observable<Formation> {
    return this.http.put<Formation>(`${this.apiUrl}/formations/${id}`, data);
  }

  deleteFormation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/formations/${id}`);
  }

  publishFormation(id: number): Observable<Formation> {
    return this.http.patch<Formation>(`${this.apiUrl}/formations/${id}/publish`, {});
  }

  archiveFormation(id: number): Observable<Formation> {
    return this.http.patch<Formation>(`${this.apiUrl}/formations/${id}/archive`, {});
  }

  // Categories
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  createCategory(data: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories`, data);
  }

  updateCategory(id: number, data: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/categories/${id}`, data);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${id}`);
  }

  // Chapters
  getChaptersByFormation(formationId: number): Observable<Chapitre[]> {
    return this.http.get<Chapitre[]>(`${this.apiUrl}/formations/${formationId}/chapters`);
  }

  createChapter(formationId: number, data: any): Observable<Chapitre> {
    return this.http.post<Chapitre>(`${this.apiUrl}/formations/${formationId}/chapters`, data);
  }

  updateChapter(id: number, data: any): Observable<Chapitre> {
    return this.http.put<Chapitre>(`${this.apiUrl}/chapters/${id}`, data);
  }

  deleteChapter(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/chapters/${id}`);
  }

  reorderChapter(id: number, chapterOrder: number): Observable<Chapitre> {
    return this.http.patch<Chapitre>(`${this.apiUrl}/chapters/${id}/reorder`, { chapterOrder });
  }
}
