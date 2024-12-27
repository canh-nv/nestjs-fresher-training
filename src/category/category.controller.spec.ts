import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
//import { UpdateCategoryDto } from './dto/update-category.dto';

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
});
