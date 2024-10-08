import crypto from 'crypto';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import type { Role, User } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { USER_ROLE } from 'src/common/constants';
import { UserSanitized } from 'src/common/types';
import { sanitizeUser } from 'src/common/utils';
import { PaymentService } from '../payment/payment.service';

interface UserCreateInput {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: Role;
}

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly paymentService: PaymentService,
  ) {}

  async create({
    email,
    firstName,
    lastName,
    password,
    role = USER_ROLE.REGULAR,
  }: UserCreateInput): Promise<UserSanitized> {
    const existingUser = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser)
      throw new ConflictException('User with this email already exists');

    const hash = await argon2.hash(password);

    const plan = await this.prismaService.plan.findUnique({
      where: {
        name: 'Free',
      },
    });

    if (!plan) throw new ForbiddenException('Free plan not found');

    const customer = await this.paymentService.createCustomer({
      email,
      name: `${firstName} ${lastName}`,
    });

    const user = await this.prismaService.user.create({
      data: {
        email,
        firstName,
        lastName,
        hash,
        role,
        planId: plan.id,
        stripeCustomerId: customer.id,
      },
    });

    return sanitizeUser(user);
  }

  async update(
    userId: number,
    { ...rest }: Partial<Omit<User, 'id'>>,
  ): Promise<UserSanitized> {
    const user = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        ...rest,
      },
    });

    delete user.hash;

    return sanitizeUser(user);
  }

  async validate(email: string, password: string): Promise<UserSanitized> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        plan: true,
      },
    });

    if (!user) return null;

    const valid = await argon2.verify(user.hash, password);

    if (!valid) return null;

    return sanitizeUser(user);
  }

  async changePlan(userId: number, planId: number): Promise<UserSanitized> {
    const existingUser = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) throw new ForbiddenException('User not found');

    const plan = await this.prismaService.plan.findUnique({
      where: {
        id: planId,
      },
    });

    if (!plan) throw new ForbiddenException('Plan not found');

    const user = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        planId: plan.id,
      },
    });

    return sanitizeUser(user);
  }

  async generateResetPasswordHash(id: number): Promise<string> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new ForbiddenException('User not found');

    const today = new Date();

    const token = crypto.randomBytes(32).toString('hex');
    const hash = await argon2.hash(token);
    const expires = new Date(today.getTime() + 60 * 60 * 1000);

    await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        resetPasswordHash: hash,
        resetPasswordHashExpiry: expires,
      },
    });

    return token;
  }

  async resetPassword(userId: number, token: string, newPassword: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new ForbiddenException('User not found');
    if (!user.resetPasswordHash) throw new ForbiddenException('Invalid token');
    if (user.resetPasswordHashExpiry < new Date())
      throw new ForbiddenException('Token expired');

    const tokenMatches = await argon2.verify(user.resetPasswordHash, token);

    if (!tokenMatches) throw new ForbiddenException('Invalid token');

    const hash = await argon2.hash(newPassword);

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        hash,
        resetPasswordHash: null,
        resetPasswordHashExpiry: null,
      },
    });
  }

  async getSanitizedById(id: number): Promise<UserSanitized> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    return sanitizeUser(user);
  }

  async getSanitized(params: { where: Partial<User> }): Promise<UserSanitized> {
    const user = await this.prismaService.user.findFirst({
      where: params.where,
    });

    return sanitizeUser(user);
  }

  async generateConfirmEmailToken(id: number): Promise<string> {
    const user = await this.getSanitizedById(id);

    if (!user) throw new ForbiddenException('User not found');

    const today = new Date();

    const token = crypto.randomBytes(32).toString('hex');
    const hash = await argon2.hash(token);

    await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        confirmEmailHash: hash,
        confirmEmailHashExpiry: new Date(today.getTime() + 60 * 60 * 1000),
      },
    });

    return token;
  }

  async confirmEmail(userId: number, token: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new ForbiddenException('User not found');
    if (user.isEmailConfirmed)
      throw new ConflictException('Email is already confirmed');
    if (!user.confirmEmailHash) throw new ForbiddenException('Invalid token');
    if (user.confirmEmailHashExpiry < new Date())
      throw new ForbiddenException('Token expired');

    const tokenMatches = await argon2.verify(user.confirmEmailHash, token);

    if (!tokenMatches) throw new ForbiddenException('Invalid token');

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        isEmailConfirmed: true,
        confirmEmailHash: null,
        confirmEmailHashExpiry: null,
      },
    });

    return sanitizeUser(user);
  }

  async resetRefreshTokenHash(userId: number) {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshTokenHash: null,
      },
    });
  }

  async validateRefreshTokenHash(
    userId: number,
    refreshToken: string,
  ): Promise<UserSanitized | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.refreshTokenHash)
      throw new ForbiddenException('Access denied');

    const refreshTokenHashMatches = await argon2.verify(
      user.refreshTokenHash,
      refreshToken,
    );

    return refreshTokenHashMatches ? sanitizeUser(user) : null;
  }
}
