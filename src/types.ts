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
  code?: string;
  allowPlusOne?: boolean;
  sportsCarnival?: boolean;
  bustransport?: 'ACCEPTED' | 'DECLINED' | 'PENDING';
  address?: string;
  firstSeenAt?: Date;
  lastSeenAt?: Date;
  createdAt?: string;
  updatedAt?: string;
  visits?: number;
}

export interface User {
  id?: string | undefined;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  email: string;
  // status: string;
  // relation: string;
  dietary: string;
  allergies: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface InviteWithUsers {
  code: string;
  allowPlusOne?: boolean;
  firstSeenAt?: string;
  lastSeenAt?: Date;
  createdAt?: string;
  updatedAt?: string;
  bustransport?: 'ACCEPTED' | 'DECLINED' | 'PENDING';
  address?: string;
  sportsCarnival?: boolean;
  UserInvite: UserInvite[];
  visits?: number;
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

export interface Metadata {
  event: string;
  datetime: Date;
}

export type Theme = 'light' | 'dark';
