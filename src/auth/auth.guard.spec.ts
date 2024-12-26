import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { jwtConstants } from './constant';

describe('AuthGuard', () => {
    let authGuard: AuthGuard;
    let jwtService: JwtService;
    let reflector: Reflector;

    beforeEach(() => {
        jwtService = new JwtService({ secret: jwtConstants.secret });
        reflector = new Reflector();
        authGuard = new AuthGuard(jwtService, reflector);
    });

    it('should return true if the route is public', async () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

        const context = {
            getHandler: jest.fn(),
            getClass: jest.fn(),
            switchToHttp: jest.fn(),
        } as unknown as ExecutionContext;

        const result = await authGuard.canActivate(context);
        expect(result).toBe(true);
    });

    it('should throw UnauthorizedException if no token is provided', async () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

        const context = {
            switchToHttp: () => ({
                getRequest: () => ({
                    headers: {
                        authorization: undefined,
                    },
                }),
            }),
        } as unknown as ExecutionContext;

        await expect(authGuard.canActivate(context)).rejects.toThrow(
            UnauthorizedException,
        );
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
        jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(
            new Error('Invalid token'),
        );

        const context = {
            switchToHttp: () => ({
                getRequest: () => ({
                    headers: {
                        authorization: 'Bearer invalid.token',
                    },
                }),
            }),
        } as unknown as ExecutionContext;

        await expect(authGuard.canActivate(context)).rejects.toThrow(
            UnauthorizedException,
        );
    });

    it('should set request.user if token is valid', async () => {
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
        const mockPayload = { id: 1, email: 'test@example.com' };
        jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockPayload);

        const mockRequest = {
            headers: {
                authorization: 'Bearer valid.token',
            },
            user: null,
        };

        const context = {
            switchToHttp: () => ({
                getRequest: () => mockRequest,
            }),
        } as unknown as ExecutionContext;

        const result = await authGuard.canActivate(context);

        expect(result).toBe(true);
        expect(mockRequest.user).toEqual(mockPayload);
    });
});
