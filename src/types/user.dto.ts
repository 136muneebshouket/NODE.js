export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}

export interface UserResponseDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}