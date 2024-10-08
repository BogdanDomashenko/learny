import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/jwtToken.strategy';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [JwtModule.register({}), UserModule, MailerModule],
  providers: [AccessTokenStrategy, RefreshTokenStrategy, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
