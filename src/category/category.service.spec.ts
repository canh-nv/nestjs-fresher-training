import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { BadRequestException } from '@nestjs/common';
//import { Product } from 'src/product/entities/product.entity';

describe('CategoryService', () => {
    let service: CategoryService;
    let repository: Repository<Category>;

    const mockCategory = {
        id: 1,
        categoryName: 'Test Category',
        createAt: new Date(),
        updateAt: new Date(),
        products: [],
    };

    const mockProduct = {
        id: 1,
        name: 'Test Product',
        price: 100,
        category: mockCategory,
    };
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoryService,
                {
                    provide: getRepositoryToken(Category),
                    useValue: {
                        findOne: jest.fn(),
                        find: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<CategoryService>(CategoryService);
        repository = module.get<Repository<Category>>(
            getRepositoryToken(Category),
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repository).toBeDefined();
    });
    describe('Create', () => {
        it('should create a category with timestamps', async () => {
            const createDate = new Date();
            const dto = {
                categoryName: 'Test Category',
                createAt: createDate,
                updateAt: createDate,
                products: [],
            };

            jest.spyOn(repository, 'findOne').mockResolvedValue(null);
            jest.spyOn(repository, 'create').mockReturnValue(dto as any);
            jest.spyOn(repository, 'save').mockResolvedValue({
                ...dto,
                id: 1,
            } as any);

            const result = await service.create(dto as any);
            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('createAt');
            expect(result).toHaveProperty('updateAt');
            expect(result.products).toEqual([]);
        });
        it('should throw BadRequestException if category already exists', async () => {
            const dto = { categoryName: 'Existing Category' };
            jest.spyOn(repository, 'findOne').mockResolvedValue(dto as any);

            await expect(service.create(dto as any)).rejects.toThrow(
                BadRequestException,
            );
            expect(repository.findOne).toHaveBeenCalledWith({
                where: { categoryName: dto.categoryName },
            });
        });
    });
    describe('findAll', () => {
        it('should return all categories with their related products', async () => {
            const categoriesWithProducts = [
                {
                    ...mockCategory,
                    products: [mockProduct],
                },
                {
                    ...mockCategory,
                    id: 2,
                    categoryName: 'Test Category 2',
                    products: [],
                },
            ];

            jest.spyOn(repository, 'find').mockResolvedValue(
                categoriesWithProducts as any,
            );

            const result = await service.findAll();
            expect(result).toHaveLength(2);
            expect(result[0].products).toHaveLength(1);
            expect(result[1].products).toHaveLength(0);
        });
    });
});
