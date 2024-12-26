import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { registerUserDTO } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import { loginDTO } from './dto/login.dto';
import { IUser } from './interfaces/iuser.interfaces';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Cart } from 'src/cart/entities/cart.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Cart) private cartRepository: Repository<Cart>,
        private usersService: UserService,
        private jwt: JwtService,
        private configService: ConfigService,
        // eslint-disable-next-line prettier/prettier
    ) {}

    async generateToken(payload: IUser) {
        const access_token = await this.jwt.signAsync(payload);
        const refresh_token = await this.jwt.signAsync(payload, {
            secret: this.configService.get<string>('refresh_key'),
            expiresIn: this.configService.get<string>('expirein'),
        });

        await this.userRepository.update(
            { email: payload.email },
            { refresh_token: refresh_token },
        );
        return { access_token, refresh_token };
    }

    async hashPassword(password: string) {
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(password, saltOrRounds);
        return hash;
    }

    async register(register: registerUserDTO): Promise<any> {
        const userEmail = await this.userRepository.findOne({
            where: { email: register.email },
        });
        if (userEmail) {
            throw new BadRequestException('Email is already exist');
        }

        const password = await this.hashPassword(register.password);
        const createAccount = await this.userRepository.save({
            ...register,
            password,
        });
        return createAccount;
    }

    async checkPassword(password: string, hash: string) {
        return await bcrypt.compare(password, hash);
    }

    async login(loginDTO: loginDTO): Promise<any> {
        const findUser = await this.usersService.findOneByUsername(
            loginDTO.email,
        );
        if (!findUser) {
            throw new BadRequestException('Wrong email or password!');
        }

        const comparePass = await bcrypt.compare(
            loginDTO.password,
            findUser.password,
        );
        if (!comparePass) {
            throw new BadRequestException('Wrong email or password!');
        }

        const payload: IUser = {
            id: findUser.id,
            email: findUser.email,
            firstName: findUser.firstName,
            lastName: findUser.lastName,
            role: findUser.role,
        };

        const gToken = this.generateToken(payload);
        return gToken;
    }

    async refreshToken(tokenObject: { refresh_token: string }): Promise<any> {
        const refresh_token = tokenObject.refresh_token;

        try {
            const verify = await this.jwt.verifyAsync(refresh_token, {
                secret: this.configService.get<string>('refresh_key'),
            });

            const user = await this.userRepository.findOne({
                where: { email: verify.email, refresh_token },
            });

            if (!user) {
                throw new HttpException(
                    'Refresh token is not valid',
                    HttpStatus.BAD_REQUEST,
                );
            }
            const payload: IUser = {
                firstName: verify.name,
                lastName: verify.lastName,
                email: verify.email,
                role: verify.role,
                id: verify.id,
            };
            return this.generateToken(payload);
        } catch (error) {
            console.error('Error in refreshToken:', (error as Error).message);
            throw new HttpException(
                'Refresh token is not valid',
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}
