import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { Prisma } from '@prisma/client';

describe('EmployeesController', () => {
  let controller: EmployeesController;

  const mockEmployee = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'ENGINEER',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockEmployeesService = {
    create: jest.fn().mockResolvedValue(mockEmployee),
    findAll: jest.fn().mockResolvedValue([mockEmployee]),
    findOne: jest.fn().mockResolvedValue(mockEmployee),
    update: jest.fn().mockResolvedValue({ ...mockEmployee, name: 'Updated' }),
    remove: jest.fn().mockResolvedValue(mockEmployee),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesController],
      providers: [
        {
          provide: EmployeesService,
          useValue: mockEmployeesService,
        },
      ],
    }).compile();

    controller = module.get<EmployeesController>(EmployeesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new employee', async () => {
      const dto: Prisma.EmployeeCreateInput = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'ENGINEER',
      };

      const result = await controller.create(dto);
      expect(result).toEqual(mockEmployee);
      expect(mockEmployeesService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all employees', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockEmployee]);
      expect(mockEmployeesService.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should return employees filtered by role', async () => {
      const result = await controller.findAll('ENGINEER');
      expect(result).toEqual([mockEmployee]);
      expect(mockEmployeesService.findAll).toHaveBeenCalledWith('ENGINEER');
    });
  });

  describe('findOne', () => {
    it('should return a single employee by id', async () => {
      const result = await controller.findOne('1');
      expect(result).toEqual(mockEmployee);
      expect(mockEmployeesService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update an employee', async () => {
      const dto: Prisma.EmployeeUpdateInput = {
        name: 'Updated',
      };

      const result = await controller.update('1', dto);
      expect(result).toEqual({ ...mockEmployee, name: 'Updated' });
      expect(mockEmployeesService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should delete an employee by id', async () => {
      const result = await controller.remove('1');
      expect(result).toEqual(mockEmployee);
      expect(mockEmployeesService.remove).toHaveBeenCalledWith(1);
    });
  });
});
