export enum DietaryRestriction {
  VEGETARIAN,
  VEGAN,
  GLUTEN_FREE,
  DAIRY_FREE,
  NUT_FREE,
  SHELLFISH_FREE,
  OTHER,
  NONE,
}

export interface Invite {
  code: string;
  allowPlusOne: boolean;
  sportsCarnival: boolean;
  firstSeenAt: string;
  lastSeenAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  status: string;
  relation: string;
  dietary: DietaryRestriction[];
  createdAt: string;
  updatedAt: string;
}

export interface UserInvite {
  userId: string;
  inviteCode: string;
  isPlusOne: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InviteWithUsers {
  code: string;
  allowPlusOne: boolean;
  firstSeenAt: string;
  lastSeenAt: string;
  createdAt: string;
  updatedAt: string;
  UserInvite: UserInvite[];
}

export interface UserInvite {
  userId: string;
  inviteCode: string;
  isPlusOne: boolean;
  status: 'ACCEPTED' | 'DECLINED' | 'PENDING';
  createdAt: string;
  updatedAt: string;
  user: User;
}

export type Theme = 'light' | 'dark' | 'dumb';
