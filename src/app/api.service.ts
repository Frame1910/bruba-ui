import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Invite, InviteWithUsers } from '../types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = 'http://localhost:3000/api';
  constructor(private http: HttpClient) {}

  getInviteByCode(code: string) {
    return this.http.get<Invite>(`${this.baseUrl}/invites/${code}`);
  }

  getInvitees(code: string) {
    return this.http.get<InviteWithUsers>(
      `${this.baseUrl}/invites/${code}/invitees`
    );
  }
}
