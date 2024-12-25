/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerUserDTO } from './dto/register.dto';
import { loginDTO } from './dto/login.dto';
import { Public } from '../metadata/metadata';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() register: registerUserDTO) {
    try {
      await this.authService.register(register);
      return { success: true };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return { success: false };
    }
  }

  @Public()
  @Post('login')
  async login(@Body() loginDTO: loginDTO) {
    try {
      const token = await this.authService.login(loginDTO); // Gọi service để lấy token
      return { success: true, token };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return { success: false };
    }
  }

  @Public()
  @Post('refresh')
  async refreshToken(@Body() body: { refresh_token: string }) {
    try {
      const newToken = await this.authService.refreshToken(body); // Gọi service để lấy token
      return { success: true, newToken };
    } catch (error) {
      return { success: false };
    }
  }
}
