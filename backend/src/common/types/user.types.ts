import { User } from '@prisma/client';

export type UserSanitized = Omit<User, 'hash' | 'stripeCustomerId'>;

export type UserSanitizedKey = keyof UserSanitized;

export type UserAccessToken = Omit<UserSanitized, 'id'> & { sub: number };
