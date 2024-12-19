import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs'; // Import bcryptjs thay vì bcrypt

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
    private configService: ConfigService
  ) { }

  async generateToken(payload: IUser) {
    const access_token = await this.jwt.signAsync(payload);
    const refresh_token = await this.jwt.signAsync(payload, {
      secret: this.configService.get<string>('refresh_key'),
      expiresIn: this.configService.get<string>('expirein'),
    });

    await this.userRepository.update(
      { email: payload.email },
      { refresh_token: refresh_token }
    );
    return { access_token, refresh_token };
  }

  // Đã thay đổi từ bcrypt.hash thành bcryptjs.hash
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
    const createAccount = await this.userRepository.save({ ...register, password });
    return createAccount;
  }

  // Đã thay đổi từ bcrypt.compareSync thành bcryptjs.compare
  async checkPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash); // bcryptjs sử dụng async compare
  }

  async login(loginDTO: loginDTO): Promise<any> {
    const findUser = await this.usersService.findOneByUsername(loginDTO.email);
    if (!findUser) {
      throw new BadRequestException('Wrong email or password!');
    }

    const comparePass = await bcrypt.compare(loginDTO.password, findUser.password); // sử dụng bcryptjs để so sánh
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
    try {
      const refresh_token = tokenObject.refresh_token;
      const verify = await this.jwt.verifyAsync(refresh_token, {
        secret: this.configService.get<string>('refresh_key'),
      });

      const check = await this.userRepository.findOne({
        where: { email: verify.email, refresh_token },
      });

      const payload: IUser = {
        firstName: verify.name,
        lastName: verify.lastName,
        email: verify.email,
        role: verify.role,
        id: verify.id,
      };

      if (check) {
        return this.generateToken(payload);
      } else {
        throw new HttpException("Refresh token not found in the database'", HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      console.log(error);
      throw new HttpException("Refresh token is not valid", HttpStatus.BAD_REQUEST);
    }
  }
}
