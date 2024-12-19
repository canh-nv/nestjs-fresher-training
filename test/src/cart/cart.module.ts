import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart, CartItem } from './entities/cart.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports:[TypeOrmModule.forFeature([Cart,CartItem]),ProductModule,UserModule,OrderModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
