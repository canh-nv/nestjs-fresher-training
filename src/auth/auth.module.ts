import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constant';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { Cart } from '../cart/entities/cart.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart]),
  JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '1d' },
  }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule { }
