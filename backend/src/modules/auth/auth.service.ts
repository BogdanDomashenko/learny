import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { MailerService } from '../mailer/mailer.service';
import { UserSanitized } from 'src/common/types';
import { SignInDto, SignUpDto } from './auth.dto';
import argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtTokens: JwtService,
    private userService: UserService,
    private mailerService: MailerService,
  ) {}

  private async getTokens({
    id,
    ...rest
  }: UserSanitized): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: id, ...rest };

    const accessToken = await this.jwtTokens.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });
    const refreshToken = await this.jwtTokens.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
    const refreshTokenHash = await argon2.hash(refreshToken);

    await this.userService.update(id, { refreshTokenHash });
    return { accessToken, refreshToken };
  }

  async signUp(input: SignUpDto): Promise<UserSanitized> {
    const user = await this.userService.create(input);

    const token = await this.userService.generateConfirmEmailToken(user.id);

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Learny - Confirm email',
      template:
        '<a href="{{url}}/auth/confirm-email/{{userId}}/{{token}}">Confirm email</a>',
      variables: {
        userId: user.id,
        token,
        url: this.configService.get<string>('FRONTEND_URL'),
      },
    });

    return user;
  }

  async signIn({ email, password }: SignInDto) {
    const user = await this.userService.validate(email, password);

    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.isEmailConfirmed)
      throw new ForbiddenException(
        'Please check your mailbox to confirm email',
      );

    const tokens = await this.getTokens(user);

    return { user, tokens };
  }

  async logout(userId: number) {
    await this.userService.resetRefreshTokenHash(userId);
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userService.validateRefreshTokenHash(
      userId,
      refreshToken,
    );

    if (!user) throw new ForbiddenException('Access denied');

    const tokens = await this.getTokens(user);

    return tokens;
  }

  async forgotPassword(email: string) {
    const user = await this.userService.getSanitized({ where: { email } });

    if (!user) throw new ForbiddenException('User not found');

    const token = await this.userService.generateResetPasswordHash(user.id);

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Learny - Password reset',
      template:
        '<a href="{{url}}/auth/reset-password/{{userId}}/{{token}}">Reset password</a>',
      variables: {
        userId: user.id,
        token,
        url: this.configService.get<string>('FRONTEND_URL'),
      },
    });
  }

  async resetPassword(userId: number, token: string, password: string) {
    return this.userService.resetPassword(userId, token, password);
  }

  async confirmEmail(userId: number, token: string) {
    return this.userService.confirmEmail(userId, token);
  }
}
