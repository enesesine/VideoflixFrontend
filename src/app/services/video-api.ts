import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VideoApi {
  private base = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/categories/`);
  }

  getVideos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/videos/`);
  }
}
