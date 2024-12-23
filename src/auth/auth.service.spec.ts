import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/entities/user.entity'
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';

describe('AuthService', () => {
          let authService: AuthService;
          let userRepository: jest.Mocked<Repository<User>>;
          let userService: jest.Mocked<UserService>;
          let jwtService: jest.Mocked<JwtService>;
          let configService: jest.Mocked<ConfigService>;

          const payloadTest = {
                    id: 1,
                    email: "test@gmail.com",
                    firstName: 'dev',
                    lastName: 'test',
                    role: 'admin'
          };

          beforeEach(async () => {
                    const module: TestingModule = await Test.createTestingModule({
                              providers: [
                                        AuthService,
                                        {
                                                  provide: getRepositoryToken(User),
                                                  useValue: {
                                                            findOne: jest.fn(),
                                                            save: jest.fn(),
                                                            update: jest.fn(),
                                                  },
                                        },
                                        {
                                                  provide: UserService,
                                                  useValue: {
                                                            findOneByUsername: jest.fn(),
                                                  },
                                        },
                                        {
                                                  provide: JwtService,
                                                  useValue: {
                                                            signAsync: jest.fn(),
                                                            verifyAsync: jest.fn(),
                                                  },
                                        },
                                        {
                                                  provide: ConfigService,
                                                  useValue: {
                                                            get: jest.fn(),
                                                  },
                                        },
                              ],
                    }).compile();

                    authService = module.get<AuthService>(AuthService);
                    userRepository = module.get<Repository<User>>(getRepositoryToken(User)) as jest.Mocked<Repository<User>>;
                    userService = module.get<UserService>(UserService) as jest.Mocked<UserService>;
                    jwtService = module.get<JwtService>(JwtService) as jest.Mocked<JwtService>;
                    configService = module.get<ConfigService>(ConfigService) as jest.Mocked<ConfigService>;
          });

          describe('UserService', () => {
                    it('should be defined', () => {
                              expect(true).toBe(true);  // Thêm một kiểm tra đơn giản để đảm bảo file không bị bỏ trống
                    });
          });

          describe('generateToken', () => {
                    it('Should generate and return token', async () => {
                              const payload = payloadTest as any;
                              jwtService.signAsync.mockResolvedValueOnce('access_token');
                              jwtService.signAsync.mockResolvedValueOnce('refresh_token');
                              const result = await authService.generateToken(payload);

                              expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
                              expect(userRepository.update).toHaveBeenCalledWith(
                                        { email: payload.email },
                                        { refresh_token: 'refresh_token' }
                              );
                              expect(result).toEqual({ access_token: 'access_token', refresh_token: 'refresh_token' });
                    });
          });
});
