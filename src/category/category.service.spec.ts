import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { BadRequestException } from '@nestjs/common';

describe('CategoryService', () => {
    let service: CategoryService;
    let repository: Repository<Category>;

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
        it('should create a category successfully', async () => {
            const dto = { categoryName: 'Test Category' };
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);
            jest.spyOn(repository, 'create').mockReturnValue(dto as any);
            jest.spyOn(repository, 'save').mockResolvedValue(dto as any);

            const result = await service.create(dto as any);
            expect(repository.findOne).toHaveBeenCalledWith({
                where: { categoryName: dto.categoryName },
            });
            expect(repository.create).toHaveBeenCalledWith(dto);
            expect(repository.save).toHaveBeenCalledWith(dto);
            expect(result).toEqual(dto);
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
});
