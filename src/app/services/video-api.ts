import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VideoApi {
  /* Base URL of the backend API */
  private base = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  /** Fetch all video categories. */
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/categories/`);
  }

  /** Fetch the list of videos with metadata (title, file, etc.). */
  getVideos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/videos/`);
  }
}
