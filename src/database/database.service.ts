import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart, CartItem } from 'src/cart/entities/cart.entity';
import { Category } from 'src/category/entities/category.entity';
import { Order, OrderItem } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('p_HOST'),
        port: +configService.get('p_PORT'),
        username: configService.get('p_USERNAME'),
        password: configService.get('p_PASSWORD'),
        database: configService.get('p_DATABASE'),
        entities: [User,Category,Product,Cart,CartItem,Order,OrderItem],
        synchronize: true,
      }),
      inject: [ConfigService],
    })
  ],
})
export class DatabaseModule{}