import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UsersService {
  private users = [
    {
      id: 1,
      name: 'Tom',
      email: 'ttichy@data.cz',
      role: 'ADMIN',
    },
    {
      id: 2,
      name: 'Jindra',
      email: 'jbrezina@data.cz',
      role: 'INTERN',
    },
    {
      id: 3,
      name: 'Ondra',
      email: 'omichalek@data.cz',
      role: 'ENGINEER',
    },
  ];

  findAll(role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
    if (role) {
      const rolesArray = this.users
        .filter((user) => user.role === role)
        .sort((a, b) => a.id - b.id);

      if (rolesArray.length === 0)
        throw new NotFoundException(`User role: ${role} not found`);
      return rolesArray.sort((a, b) => a.id - b.id);
    }
    return this.users.sort((a, b) => a.id - b.id);
  }

  findOne(id: number) {
    const user = this.users.find((user) => user.id === id);

    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  create(createUserDto: CreateUserDto) {
    const newUserID = [...this.users].sort((a, b) => b.id - a.id);
    const newId = newUserID.length ? newUserID[0].id + 1 : 1;
    const newUser = { id: newId, ...createUserDto };

    this.users.push(newUser);
    return newUser;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    this.users = this.users.map((user) =>
      user.id === id ? { ...user, ...updateUserDto } : user,
    );

    return this.findOne(id);
  }

  delete(id: number) {
    const removedUser = this.findOne(id);
    if (removedUser) this.users = this.users.filter((user) => user.id !== id);
    return removedUser;
  }
}
