import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(@InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Category) private categoriesRepository: Repository<Category>) { }

  async create(createProductDto: CreateProductDto) {
    const { categoryId, productName, ...rest } = createProductDto;
    const category = await this.categoriesRepository.findOne({ where: { id: categoryId } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const checkExist = await this.productRepository.findOne({ where:{productName}})
    if (checkExist) {
      throw new ConflictException('Product exit');
    }
    // Tạo đối tượng Product từ DTO
    const product = this.productRepository.create({...rest,productName,category});

    // Lưu vào database
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    const getAllProduct = await this.productRepository.find();
    return getAllProduct;
  }

  async findOne(id: number): Promise<Product> {
    const findProduct = await this.productRepository.findOne({ where: { id } });
    if (!findProduct) {
      throw new BadRequestException('Product not found')
    }
    return findProduct;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<any> {
    const findProduct = await this.productRepository.findOne({ where: { id } });
    if (!findProduct) {
      throw new BadRequestException('Product not found');
    }
    const UpdateProduct = await this.productRepository.update(id, updateProductDto);
    return UpdateProduct;
  }

  async remove(id: number): Promise<any> {
    const findProduct = await this.productRepository.findOne({ where: { id } });
    if (!findProduct) {
      throw new BadRequestException('Product not found')
    }
    return await this.productRepository.delete(id);

  }
}
