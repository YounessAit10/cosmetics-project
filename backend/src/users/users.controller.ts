// filepath: src/users/users.controller.ts
import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req: { user: { id: number } }) {
    return this.usersService.getProfile(req.user.id);
  }

  @Put('profile')
  async updateProfile(
    @Request() req: { user: { id: number } },
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(req.user.id, updateProfileDto);
  }

  @Put('preferences')
  async updatePreferences(
    @Request() req: { user: { id: number } },
    @Body() updatePreferencesDto: UpdatePreferencesDto,
  ) {
    return this.usersService.updatePreferences(req.user.id, updatePreferencesDto);
  }
}