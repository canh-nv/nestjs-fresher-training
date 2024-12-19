import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderItem } from './entities/order.entity';
import { ProductService } from 'src/product/product.service';
import { ProductModule } from 'src/product/product.module';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[TypeOrmModule.forFeature([Order,OrderItem]),ProductModule,UserModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports:[OrderService],
})
export class OrderModule {}
