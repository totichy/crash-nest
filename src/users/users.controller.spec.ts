import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRole } from './enums/user-role.enum';
import { NotFoundException } from '@nestjs/common';

describe('UsersController (Integration Test)', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', () => {
      const users = controller.findAll();
      expect(users).toHaveLength(3);
      expect(users[0]).toHaveProperty('id');
      expect(users[0]).toHaveProperty('name');
    });

    it('should return users filtered by role', () => {
      const interns = controller.findAll('INTERN');
      expect(interns).toHaveLength(1);
      expect(interns[0].role).toBe('INTERN');
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', () => {
      const user = controller.findOne(1);
      expect(user).toBeDefined();
      expect(user?.id).toBe(1);
    });

    it('should throw NotFoundException for non-existing user', () => {
      expect(() => controller.findOne(99)).toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new user', () => {
      const newUser = controller.create({
        name: 'Alice',
        email: 'alice@data.cz',
        role: UserRole.ADMIN,
      });

      expect(newUser).toBeDefined();
      expect(newUser.id).toBe(4);
      expect(newUser.name).toBe('Alice');

      // Ensure the new user is added
      expect(controller.findAll()).toHaveLength(4);
    });
  });

  describe('update', () => {
    it('should update an existing user', () => {
      const updatedUser = controller.update(1, { name: 'Tomáš' });
      expect(updatedUser).toBeDefined();
      expect(updatedUser?.name).toBe('Tomáš');
    });

    it('should throw NotFoundException for non-existing user', () => {
      expect(() => controller.update(99, { name: 'Ghost' })).toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a user', () => {
      const deletedUser = controller.delete(1);
      expect(deletedUser).toBeDefined();
      expect(deletedUser?.id).toBe(1);

      // Ensure the user is removed
      expect(controller.findAll()).toHaveLength(2);
    });

    it('should throw NotFoundException for non-existing user', () => {
      expect(() => controller.delete(99)).toThrow(NotFoundException);
    });
  });
});
