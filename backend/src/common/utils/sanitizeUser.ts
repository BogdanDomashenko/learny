/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from '@prisma/client';
import { UserSanitized } from '../types';

export const sanitizeUser = (user: User): UserSanitized => {
  const {
    hash,
    resetPasswordHash,
    resetPasswordHashExpiry,
    confirmEmailHash,
    confirmEmailHashExpiry,
    refreshTokenHash,
    ...userData
  } = user;

  return userData;
};
