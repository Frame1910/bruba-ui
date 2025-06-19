import { User } from './../types';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Invite, InviteWithUsers } from '../types';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = environment.apiUrl ?? 'http://localhost:3000/api';
  constructor(private http: HttpClient) {}

  getInviteByCode(code: string) {
    return this.http.get<Invite>(`${this.baseUrl}/invites/${code}`);
  }

  getInvitees(code: string) {
    return this.http.get<InviteWithUsers>(
      `${this.baseUrl}/invites/${code}/invitees`
    );
  }

  getUserInviteStatus(inviteCode: string) {
    return this.http.get(`${this.baseUrl}/user-invites/${inviteCode}/status`);
  }

  updateInviteStatuses(
    statuses: { userId: string; status: string }[],
    inviteCode: string
  ) {
    return this.http.patch(
      `${this.baseUrl}/invites/${inviteCode}/update-status`,
      statuses
    );
  }

  updateSportsCarnivalStatuses(
    statuses: { userId: string; scstatus: string }[],
    inviteCode: string
  ) {
    return this.http.patch(
      `${this.baseUrl}/invites/${inviteCode}/update-sports-carnival-status`,
      statuses
    );
  }

  createUser(user: User) {
    return this.http.post(`${this.baseUrl}/users/create`, user);
  }

  addPlusOne(
    plusOne: { userId: string; isPlusOne: boolean },
    inviteCode: string
  ) {
    return this.http.post(
      `${this.baseUrl}/user-invites/${inviteCode}/plus-one`,
      plusOne
    );
  }

  updateUser(userId: string, userInfo: User) {
    return this.http.patch(`${this.baseUrl}/users/${userId}`, userInfo);
  }

  updateInvite(inviteId: string, inviteData: Invite) {
    return this.http.patch(
      `${this.baseUrl}/invites/${inviteId}/update-invite`,
      inviteData
    );
  }

  deleteUserInvite(userId: string, inviteCode: string) {
    return this.http.delete(
      `${this.baseUrl}/user-invites/${inviteCode}/${userId}`
    );
  }

  deleteUser(userId: string) {
    return this.http.delete(`${this.baseUrl}/users/${userId}`);
  }
}
