import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/user/entities/user.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';

describe('AuthService', () => {
          let authService: AuthService;
          let userRepository: jest.Mocked<Repository<User>>;
          let cartRepository: jest.Mocked<Repository<Cart>>;
          let userService: jest.Mocked<UserService>;
          let jwtService: jest.Mocked<JwtService>;
          let configService: jest.Mocked<ConfigService>;

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
                                                  provide: getRepositoryToken(Cart),
                                                  useValue: {},
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
                    cartRepository = module.get<Repository<Cart>>(getRepositoryToken(Cart)) as jest.Mocked<Repository<Cart>>;
                    userService = module.get<UserService>(UserService) as jest.Mocked<UserService>;
                    jwtService = module.get<JwtService>(JwtService) as jest.Mocked<JwtService>;
                    configService = module.get<ConfigService>(ConfigService) as jest.Mocked<ConfigService>;
          });


});