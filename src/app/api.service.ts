import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Invite } from '../types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getInviteByCode(code: string) {
    return this.http.get<Invite>(`${this.baseUrl}/invites/${code}`);
  }
}
