import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerUserDTO } from './dto/register.dto';
import { loginDTO } from './dto/login.dto';
import { Public } from '../metadata/metadata';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('register')
  async register(@Body() register: registerUserDTO) {
    try {
      await this.authService.register(register);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  @Public()
  @Post('login')
  async login(@Body() loginDTO: loginDTO) {
    try {
      const token = await this.authService.login(loginDTO);
      return {
        success: true,
        message: 'Login successful',
        data: token,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        return {
          success: false,
          message: error.message,
        };
      }
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again later.',
      };
    }
  }

  @Public()
  @Post('refresh')
  async refreshToken(@Body() body: { refresh_token: string }) {
    try {
      const newToken = await this.authService.refreshToken(body)
      return { success: true, newToken };
    } catch (error) {
      return { success: false };
    }
  }
}
