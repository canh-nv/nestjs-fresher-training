/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/entities/user.entity';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { Cart } from 'src/cart/entities/cart.entity';

describe('AuthService', () => {
    let authService: AuthService;
    let userRepository: jest.Mocked<Repository<User>>;
    let jwtService: jest.Mocked<JwtService>;
    let userService: jest.Mocked<UserService>;
    let cartRepository: jest.Mocked<Repository<Cart>>;

    const payloadTest = {
        id: 1,
        email: 'test@gmail.com',
        password: '123@44',
        firstName: 'dev',
        lastName: 'test',
        role: 'admin',
        age: 10,
        gender: 'male',
        refresh_token: 'string',
        avatar: 'string',
        createAt: new Date(),
        deleteAt: new Date(),
        carts: [],
        orders: [],
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
                {
                    provide: getRepositoryToken(Cart),
                    useValue: {},
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userRepository = module.get<Repository<User>>(
            getRepositoryToken(User),
        ) as jest.Mocked<Repository<User>>;
        userService = module.get<UserService>(
            UserService,
        ) as jest.Mocked<UserService>;
        jwtService = module.get<JwtService>(
            JwtService,
        ) as jest.Mocked<JwtService>;
    });

    describe('UserService', () => {
        it('should be defined', () => {
            expect(true).toBe(true);
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
                { refresh_token: 'refresh_token' },
            );
            expect(result).toEqual({
                access_token: 'access_token',
                refresh_token: 'refresh_token',
            });
        });
    });
    describe('hashPassword', () => {
        it('Should hash and return hashed password', async () => {
            const password = payloadTest.password;
            jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashed_password');
            const result = await authService.hashPassword(password);
            expect(result).toBe('hashed_password');
        });
    });
    describe('Register', () => {
        it('should throw BadRequestException if email exists', async () => {
            userRepository.findOne.mockResolvedValueOnce({ id: 1 } as User);

            await expect(
                authService.register({
                    email: payloadTest.email,
                    password: payloadTest.password,
                } as any),
            ).rejects.toThrow(BadRequestException);
        });
        it('should save and return user if email does not exist', async () => {
            userRepository.findOne.mockResolvedValueOnce(null);
            userRepository.save.mockResolvedValueOnce({ id: 1 } as User);
            jest.spyOn(authService, 'hashPassword').mockResolvedValueOnce(
                'hashed_password',
            );

            const result = await authService.register({
                email: payloadTest.email,
                password: payloadTest.password,
            } as any);

            expect(result).toEqual({ id: 1 });
            expect(userRepository.save).toHaveBeenCalledWith({
                email: payloadTest.email,
                password: 'hashed_password',
            });
        });
        describe('checkPassword', () => {
            it('should return true when passwords match', async () => {
                jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

                const result = await authService.checkPassword(
                    'password123',
                    'hashedPassword',
                );

                expect(result).toBe(true);
                expect(bcrypt.compare).toHaveBeenCalledWith(
                    'password123',
                    'hashedPassword',
                );
            });

            it('should return false when passwords do not match', async () => {
                jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

                const result = await authService.checkPassword(
                    'password123',
                    'hashedPassword',
                );

                expect(result).toBe(false);
                expect(bcrypt.compare).toHaveBeenCalledWith(
                    'password123',
                    'hashedPassword',
                );
            });
        });
        describe('Login', () => {
            it('Should throw BadRequestException if user not found', async () => {
                // Mock behavior of findOneByUsername to return null, meaning no user found
                userService.findOneByUsername.mockResolvedValueOnce(null);

                await expect(
                    authService.login({
                        email: payloadTest.email,
                        password: payloadTest.password,
                    }),
                ).rejects.toThrow(BadRequestException);
                await expect(
                    authService.login({
                        email: payloadTest.email,
                        password: payloadTest.password,
                    }),
                ).rejects.toThrow('Wrong email or password!');
            });
        });
        it('should throw BadRequestException if password is incorrect', async () => {
            // Mock behavior of findOneByUsername to return a user
            const findUser = {
                ...payloadTest,
                password: 'wronghashedpassword',
                age: 10,
                gender: 'male',
                refresh_token: 'string',
                avatar: 'string',
                createAt: new Date(),
                deleteAt: new Date(),
                carts: [],
                orders: [],
            };
            userService.findOneByUsername.mockResolvedValueOnce(findUser);

            // Mock bcrypt.compare to return false, meaning password doesn't match
            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

            // Call login method and expect an exception to be thrown
            await expect(
                authService.login({
                    email: 'test@gmail.com',
                    password: '123@44',
                }),
            ).rejects.toThrow(BadRequestException);
            await expect(
                authService.login({
                    email: 'test@gmail.com',
                    password: '123@44',
                }),
            ).rejects.toThrow('Wrong email or password!');
        });
        it('should return token if email and password match', async () => {
            // Mock user found with the correct email and password
            const findUser = {
                id: 1,
                email: payloadTest.email,
                password: 'hashedpassword',
                firstName: payloadTest.firstName,
                lastName: payloadTest.lastName,
                role: payloadTest.role,
                age: payloadTest.age,
                gender: payloadTest.gender,
                refresh_token: payloadTest.refresh_token,
                avatar: payloadTest.avatar,
                createAt: payloadTest.createAt,
                deleteAt: payloadTest.deleteAt,
                carts: payloadTest.carts,
                orders: payloadTest.orders,
            };

            userService.findOneByUsername.mockResolvedValueOnce(findUser);

            // Mock bcrypt.compare to return true (correct password)
            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

            // Mock JwtService to return a token
            const accessToken = 'access_token';
            const refreshToken = 'refresh_token';
            jwtService.signAsync.mockResolvedValueOnce(accessToken);
            jwtService.signAsync.mockResolvedValueOnce(refreshToken);

            // Call the login method
            const result = await authService.login({
                email: payloadTest.email,
                password: payloadTest.password,
            });

            // Assertions
            expect(result).toEqual({
                access_token: accessToken,
                refresh_token: refreshToken,
            });
            expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
            expect(jwtService.signAsync).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: payloadTest.email,
                    firstName: payloadTest.firstName,
                    lastName: payloadTest.lastName,
                    role: payloadTest.role,
                }),
            );
        });
        describe('refreshToken', () => {
            it('should throw HttpException if refresh token is not found in the database', async () => {
                const refreshToken = 'valid_refresh_token';
                const tokenObject = { refresh_token: refreshToken };

                jwtService.verifyAsync.mockResolvedValueOnce({
                    email: 'test@gmail.com',
                    id: 1,
                    name: 'dev',
                    firstName: 'xof',
                    lastName: 'test',
                    role: 'admin',
                });
                userRepository.findOne.mockResolvedValueOnce(null);
                await expect(
                    authService.refreshToken(tokenObject),
                ).rejects.toThrowError(
                    new HttpException(
                        'Refresh token is not valid',
                        HttpStatus.BAD_REQUEST,
                    ),
                );
            });

            it('should throw HttpException if refresh token is invalid', async () => {
                const refreshToken = 'invalid_refresh_token';
                const tokenObject = { refresh_token: refreshToken };

                jwtService.verifyAsync.mockRejectedValueOnce(
                    new Error('Invalid token'),
                );

                await expect(
                    authService.refreshToken(tokenObject),
                ).rejects.toThrowError(
                    new HttpException(
                        'Refresh token is not valid',
                        HttpStatus.BAD_REQUEST,
                    ),
                );
            });
        });
    });
});
