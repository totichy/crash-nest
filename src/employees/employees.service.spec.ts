import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesService } from './employees.service';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';

describe('EmployeesService', () => {
  let service: EmployeesService;

  const mockEmployee = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'ENGINEER',
  };

  const mockDatabaseService = {
    employee: {
      create: jest.fn().mockResolvedValue(mockEmployee),
      findMany: jest.fn().mockResolvedValue([mockEmployee]),
      findUnique: jest.fn().mockResolvedValue(mockEmployee),
      update: jest
        .fn()
        .mockResolvedValue({ ...mockEmployee, name: 'Updated Name' }),
      delete: jest.fn().mockResolvedValue(mockEmployee),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an employee', async () => {
    const dto: Prisma.EmployeeCreateInput = {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'ENGINEER',
    };
    const result = await service.create(dto);
    expect(result).toEqual(mockEmployee);
    expect(mockDatabaseService.employee.create).toHaveBeenCalledWith({
      data: dto,
    });
  });

  it('should find all employees', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockEmployee]);
    expect(mockDatabaseService.employee.findMany).toHaveBeenCalledWith();
  });

  it('should find employees by role', async () => {
    const role = 'ENGINEER';
    const result = await service.findAll(role);
    expect(result).toEqual([mockEmployee]);
    expect(mockDatabaseService.employee.findMany).toHaveBeenCalledWith({
      where: { role },
    });
  });

  it('should find one employee', async () => {
    const result = await service.findOne(1);
    expect(result).toEqual(mockEmployee);
    expect(mockDatabaseService.employee.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should update an employee', async () => {
    const updateDto: Prisma.EmployeeUpdateInput = { name: 'Updated Name' };
    const result = await service.update(1, updateDto);
    expect(result).toEqual({ ...mockEmployee, name: 'Updated Name' });
    expect(mockDatabaseService.employee.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: updateDto,
    });
  });

  it('should remove an employee', async () => {
    const result = await service.remove(1);
    expect(result).toEqual(mockEmployee);
    expect(mockDatabaseService.employee.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});
