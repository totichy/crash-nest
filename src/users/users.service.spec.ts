import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRole } from './enums/user-role.enum';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users sorted by id', () => {
      const users = service.findAll();
      expect(users).toHaveLength(3);
      expect(users[0].id).toBe(1);
      expect(users[1].id).toBe(2);
      expect(users[2].id).toBe(3);
    });

    it('should return only users with a specified role', () => {
      const interns = service.findAll('INTERN');
      expect(interns).toHaveLength(1);
      expect(interns[0].role).toBe('INTERN');
    });

    it('should throw NotFoundException if role does not exist', () => {
      expect(() => service.findAll('SUPER_ADMIN' as any)).toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a user by id', () => {
      const user = service.findOne(1);
      expect(user).toBeDefined();
      expect(user.id).toBe(1);
    });

    it('should throw NotFoundException if user does not exist', () => {
      expect(() => service.findOne(99)).toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new user', () => {
      const newUser = service.create({
        name: 'Alice',
        email: 'alice@data.cz',
        role: UserRole.ADMIN,
      });

      expect(newUser).toBeDefined();
      expect(newUser.id).toBe(4);
      expect(newUser.name).toBe('Alice');
    });

    it('should increment the user ID', () => {
      const newUser1 = service.create({
        name: 'Bob',
        email: 'bob@data.cz',
        role: UserRole.INTERN,
      });

      const newUser2 = service.create({
        name: 'Charlie',
        email: 'charlie@data.cz',
        role: UserRole.ADMIN,
      });

      expect(newUser1.id).toBe(4);
      expect(newUser2.id).toBe(5);
    });
  });

  describe('update', () => {
    it('should update a user if they exist', () => {
      const updatedUser = service.update(1, {
        name: 'Tomáš',
        email: 'tom@data.cz',
      });
      expect(updatedUser).toBeDefined();
      expect(updatedUser.name).toBe('Tomáš');
      expect(updatedUser.email).toBe('tom@data.cz');
    });

    it('should throw NotFoundException if user does not exist', () => {
      expect(() => service.update(99, { name: 'Ghost' })).toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a user if they exist', () => {
      const deletedUser = service.delete(2);
      expect(deletedUser).toBeDefined();
      expect(deletedUser.id).toBe(2);

      const usersAfterDelete = service.findAll();
      expect(usersAfterDelete).toHaveLength(2);
      expect(() => service.findOne(2)).toThrow(NotFoundException);
    });

    it('should throw NotFoundException if user does not exist', () => {
      expect(() => service.delete(99)).toThrow(NotFoundException);
    });
  });
});
