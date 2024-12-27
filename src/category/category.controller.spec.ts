import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoryController', () => {
    let controller: CategoryController;
    let sservice: CategoryService;

    const mockCategoryService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CategoryController],
            providers: [
                {
                    provide: CategoryService,
                    useValue: mockCategoryService,
                },
            ],
        }).compile();

        controller = module.get<CategoryController>(CategoryController);
        sservice = module.get<CategoryService>(CategoryService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    describe('create', () => {
        it('should call service.create with correct data', async () => {
            const createDto: CreateCategoryDto = { categoryName: 'Test' };
            mockCategoryService.create.mockResolvedValue(createDto);

            const result = await controller.create(createDto);

            expect(sservice.create).toHaveBeenCalledWith(createDto);
            expect(result).toEqual(createDto);
        });
    });
    describe('findAll', () => {
        it('should call service.findAll and return all categories', async () => {
            const categories = [{ id: 1, categoryName: 'Test' }];
            mockCategoryService.findAll.mockResolvedValue(categories);

            const result = await controller.findAll();

            expect(sservice.findAll).toHaveBeenCalled();
            expect(result).toEqual(categories);
        });
    });
    describe('findOne', () => {
        it('should call service.findOne with correct id and return the category', async () => {
            const category = { id: 1, categoryName: 'Test' };
            mockCategoryService.findOne.mockResolvedValue(category);

            const result = await controller.findOne(1);

            expect(sservice.findOne).toHaveBeenCalledWith(1);
            expect(result).toEqual(category);
        });
    });
    describe('update', () => {
        it('should call service.update with correct id and data', async () => {
            const updateDto: UpdateCategoryDto = {
                categoryName: 'Updated Test',
            };
            const updatedCategory = { id: 1, categoryName: 'Updated Test' };
            mockCategoryService.update.mockResolvedValue(updatedCategory);

            const result = await controller.update(1, updateDto);

            expect(sservice.update).toHaveBeenCalledWith(1, updateDto);
            expect(result).toEqual(updatedCategory);
        });
    });

    describe('remove', () => {
        it('should call service.remove with correct id', async () => {
            mockCategoryService.remove.mockResolvedValue({ affected: 1 });

            const result = await controller.remove('1');

            expect(sservice.remove).toHaveBeenCalledWith(1);
            expect(result).toEqual({ affected: 1 });
        });
    });
});
