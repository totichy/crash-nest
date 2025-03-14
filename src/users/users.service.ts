import { Injectable } from '@nestjs/common';

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
    if (role)
      return this.users
        .filter((user) => user.role === role)
        .sort((a, b) => a.id - b.id);
    return this.users.sort((a, b) => a.id - b.id);
  }

  findOne(id: number) {
    const user = this.users.find((user) => user.id === id);
    return user;
  }

  create(user: {
    name: string;
    email: string;
    role: 'INTERN' | 'ENGINEER' | 'ADMIN';
  }) {
    console.log(this.users);
    const newUserID = [...this.users].sort((a, b) => b.id - a.id);
    console.log(newUserID[0].id);
    const newId = newUserID.length ? newUserID[0].id + 1 : 1;
    const newUser = { id: newId, ...user };

    this.users.push(newUser);
    return newUser;
  }

  update(
    id: number,
    updatedUser: {
      name?: string;
      email?: string;
      role?: 'INTERN' | 'ENGINEER' | 'ADMIN';
    },
  ) {
    this.users = this.users.map((user) =>
      user.id === id ? { ...user, ...updatedUser } : user,
    );

    return this.findOne(id);
  }

  delete(id: number) {
    const removedUser = this.findOne(id);
    if (removedUser) this.users = this.users.filter((user) => user.id !== id);
    return removedUser;
  }
}
