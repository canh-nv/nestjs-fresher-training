import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
        // eslint-disable-next-line prettier/prettier
    ) {}

    async create(createCategoryDto: CreateCategoryDto) {
        const checkExist = await this.categoryRepository.findOne({
            where: { categoryName: createCategoryDto.categoryName },
        });
        if (checkExist) {
            throw new BadRequestException('category exist');
        }
        const createRepository =
            await this.categoryRepository.create(createCategoryDto);
        return await this.categoryRepository.save(createRepository);
    }

    async findAll(): Promise<Category[]> {
        const findAllCate = await this.categoryRepository.find();
        return findAllCate;
    }

    async findOne(id: number): Promise<Category> {
        const find1 = await this.categoryRepository.findOne({ where: { id } });
        if (!find1) {
            throw new BadRequestException('Category not found');
        }
        return find1;
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto) {
        const checkExits = await this.categoryRepository.findOne({
            where: { id },
        });
        if (!checkExits) {
            throw new BadRequestException('Category not found');
        }
        const updateCategory = await this.categoryRepository.update(
            id,
            updateCategoryDto,
        );
        const message = 'update success';
        return { message, updateCategory };
    }

    async remove(id: number): Promise<any> {
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: ['products'], // Lấy thêm quan hệ products
        });

        if (!category) {
            throw new BadRequestException('Category Not found');
        }

        if (category.products && category.products.length > 0) {
            // eslint-disable-next-line prettier/prettier
            throw new BadRequestException(
                'Cannot delete category with related products',
            );
        }

        return await this.categoryRepository.delete(id);
    }
}
