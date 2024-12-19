import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>) { }

  async create(createCategoryDto: CreateCategoryDto) {
    const checkExist = await this.categoryRepository.findOne({where:{categoryName:createCategoryDto.categoryName}});
    if(checkExist)
    {
      throw new BadRequestException('category exist');
    }
    const createRepository = await this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(createRepository);

  }

  async findAll():Promise<Category[]> {
    const findAllCate = await this.categoryRepository.find();
    return findAllCate;
  }

  async findOne(id: number):Promise<Category> {
    const find1 = await this.categoryRepository.findOne({where:{id}});
    if (!find1)
    {
      throw new BadRequestException('Category not found');
    }
    return find1;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const checkExits = await this.categoryRepository.findOne({where:{id}});
    if (!checkExits)
    {
      throw new BadRequestException('Category not found');
    }
    const updateCategory = await this.categoryRepository.update(id,updateCategoryDto);
    const message = 'update success'
    return message;
  }

  async remove(id: number):Promise<any> {
    const checkExits = await this.categoryRepository.findOne({where:{id}});
    if (!checkExits)
    {
      throw new BadRequestException('Category Not found');
    }
    const removeCate = await this.categoryRepository.delete(id);
    return removeCate;
  }
}
