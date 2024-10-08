import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import {
  ConfirmEmailDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
} from './auth.dto';
import { AuthService } from './auth.service';
import { ResponseMessage } from '../../common/types';
import { AccessTokenGuard, RefreshTokenGuard } from '../../common/guards';

const oneWeek = 7 * 24 * 3600 * 1000;
const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = {
  httpOnly: true,
  secure: isProduction, // secure: true means only send cookie over https
  sameSite: isProduction ? 'none' : '',
  expires: new Date(Date.now() + oneWeek),
  maxAge: oneWeek,
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() body: SignUpDto): Promise<ResponseMessage> {
    await this.authService.signUp(body);

    return {
      message: 'User created successfully',
    };
  }

  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) res,
    @Body() body: SignInDto,
  ): Promise<any> {
    const { user, tokens } = await this.authService.signIn(body);

    res.cookie('refreshToken', tokens.refreshToken, cookieOptions);
    return { user, accessToken: tokens.accessToken };
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  async logout(
    @Res({ passthrough: true }) res,
    @Req() req,
  ): Promise<ResponseMessage> {
    await this.authService.logout(req.user['sub']);

    res.clearCookie('refreshToken');

    return {
      message: 'User logged out successfully',
    };
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(@Res({ passthrough: true }) res, @Req() req) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    const tokens = await this.authService.refreshTokens(userId, refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, cookieOptions);

    return { accessToken: tokens.accessToken };
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() body: ForgotPasswordDto,
  ): Promise<ResponseMessage> {
    await this.authService.forgotPassword(body.email);

    return {
      message: 'Password reset link sent to your email',
    };
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: ResetPasswordDto,
  ): Promise<ResponseMessage> {
    await this.authService.resetPassword(
      body.userId,
      body.token,
      body.password,
    );

    return {
      message: 'Password reset successfully',
    };
  }

  @Post('confirm-email')
  async confirmEmail(@Body() body: ConfirmEmailDto): Promise<ResponseMessage> {
    await this.authService.confirmEmail(body.userId, body.token);

    return {
      message: 'Email confirmed successfully',
    };
  }
}
