import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

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

    // it('should return an empty array if role does not exist', () => {
    //   const roleUsers = service.findAll('ENGINEER');
    //   expect(roleUsers).toHaveLength(0);
    // });
  });

  describe('findOne', () => {
    it('should return a user by id', () => {
      const user = service.findOne(1);
      expect(user).toBeDefined();
      expect(user?.id).toBe(1);
    });

    it('should return undefined if user does not exist', () => {
      const user = service.findOne(99);
      expect(user).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create and return a new user', () => {
      const newUser = service.create({
        name: 'Alice',
        email: 'alice@data.cz',
        role: 'ADMIN',
      });

      console.log(newUser);

      expect(newUser).toBeDefined();
      expect(newUser.id).toBe(4);
      expect(newUser.name).toBe('Alice');
    });
  });

  describe('create', () => {
    it('should increment the user ID', () => {
      const newUser1 = service.create({
        name: 'Bob',
        email: 'bob@data.cz',
        role: 'INTERN',
      });

      const newUser2 = service.create({
        name: 'Charlie',
        email: 'charlie@data.cz',
        role: 'ADMIN',
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
      expect(updatedUser?.name).toBe('Tomáš');
      expect(updatedUser?.email).toBe('tom@data.cz');
    });

    it('should not update a non-existing user', () => {
      const updatedUser = service.update(99, { name: 'Ghost' });
      expect(updatedUser).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('should delete a user if they exist', () => {
      const deletedUser = service.delete(2);
      expect(deletedUser).toBeDefined();
      expect(deletedUser?.id).toBe(2);

      const usersAfterDelete = service.findAll();
      expect(usersAfterDelete).toHaveLength(2);
      expect(service.findOne(2)).toBeUndefined();
    });

    it('should return undefined if trying to delete a non-existent user', () => {
      const deletedUser = service.delete(99);
      expect(deletedUser).toBeUndefined();
    });
  });
});
