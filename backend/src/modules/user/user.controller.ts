import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenGuard } from '../../common/guards';
import { User } from '../../common/decorators';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(AccessTokenGuard)
  async getMe(@User() user: any) {
    return this.userService.getSanitizedById(Number(user.sub));
  }
}
