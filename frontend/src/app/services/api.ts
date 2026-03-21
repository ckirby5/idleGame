import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';
  
  constructor(private http: HttpClient, private auth: AuthService) {

  }

  private getAuthHeaders() {
    const token = this.auth.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAvailableResources() : Observable<any> {
    return this.http.get(`${this.apiUrl}/mining/resources`, { headers: this.getAuthHeaders() });
  }

  startMining(resourceId: number) : Observable<any> {
    return this.http.post(`${this.apiUrl}/mining/start`, { resourceId }, { headers: this.getAuthHeaders() });
  }

  getMiningStatus() : Observable<any> {
    return this.http.get(`${this.apiUrl}/mining/status`, { headers: this.getAuthHeaders() });
  }

  stopMining() : Observable<any> {
    return this.http.post(`${this.apiUrl}/mining/stop`, {}, { headers: this.getAuthHeaders() });
  }

}
