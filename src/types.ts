export enum DietaryRestriction {
  VEGETARIAN,
  VEGAN,
  PESCATARIAN,
  GLUTEN_FREE,
  DAIRY_FREE,
  KOSHER,
  HALAL,
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
  id?: string | undefined;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  email: string;
  // status: string;
  // relation: string;
  dietary: DietaryRestriction[];
  allergies: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface InviteWithUsers {
  code: string;
  allowPlusOne: boolean;
  firstSeenAt: string;
  lastSeenAt: string;
  createdAt: string;
  updatedAt: string;
  sportsCarnival: boolean;
  UserInvite: UserInvite[];
}

export interface UserInvite {
  userId: string;
  inviteCode: string;
  isPlusOne: boolean;
  scstatus: 'ACCEPTED' | 'DECLINED' | 'PENDING';
  status: 'ACCEPTED' | 'DECLINED' | 'PENDING';
  createdAt?: string;
  updatedAt?: string;
  user: User;
}

export type Theme = 'light' | 'dark' | 'dumb';
