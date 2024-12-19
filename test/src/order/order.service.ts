import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderItem } from './entities/order.entity';
import { Repository } from 'typeorm';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';
import { timeStamp } from 'console';
import { REQUEST_CONTEXT_ID } from '@nestjs/core/router/request/request-constants';
import { MESSAGES } from '@nestjs/core/constants';

@Injectable()
export class OrderService {
  constructor(@InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepository: Repository<OrderItem>,
    private productService: ProductService,
    private userService: UserService,
  ) { }
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, items } = createOrderDto;
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const orderItems: OrderItem[] = [];
    let total = 0;
    for (const item of items) {
      const product = await this.productService.findOne(item.productId)
      if (!product) {
        throw new NotFoundException('Product Not found');
      }
      const orderItem = this.orderItemRepository.create({
        product,
        quantity: item.quantity,
        price: product.productPrice * item.quantity
      });
      orderItems.push(orderItem);
      total += orderItem.price

    }
    const order = this.orderRepository.create({
      user,
      status: 'placed',
      total,
      items: orderItems
    });
    return this.orderRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['items', 'items.product'] })
  }

  async findOrderById(id: number): Promise<Order> {
    const findOrder = await this.orderRepository.findOne({ where: { id } });
    if (!findOrder) {
      throw new NotFoundException('Order Not found');
    }
    return findOrder;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOrderById(id)
    if (!order) {
      throw new NotFoundException('Order not found')
    }
    // Update the order status
    order.status = updateOrderDto.status;
    return this.orderRepository.save(order);
  }

  async remove(id: number):Promise<any> {
    const order = await this.findOrderById(id)
    if (!order) {
      throw new NotFoundException('Order not found')
    }
    await this.orderRepository.remove(order);
    const message = 'Xoá thành công'
    return message;
  }
}
