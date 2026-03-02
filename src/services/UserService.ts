import bcrypt from 'bcrypt';
import { BaseService } from './BaseService';
import User from '../models/User';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../types/user.dto';

export class UserService extends BaseService<User> {
  constructor() {
    super(User);
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.create({
      ...userData,
      password: hashedPassword,
    });
    return user;
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.findOne({ where: { email } });
  }

  async updateUser(id: number, userData: UpdateUserDto): Promise<[number, User[]]> {
    return await this.update(id, userData);
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.findAll({
      attributes: { exclude: ['password', 'deletedAt'] },
    });
    return users.map(this.mapToResponseDto);
  }

  async getUserById(id: number): Promise<UserResponseDto | null> {
    const user = await this.findById(id, {
      attributes: { exclude: ['password', 'deletedAt'] },
    });
    return user ? this.mapToResponseDto(user) : null;
  }

  private mapToResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}