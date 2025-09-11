// types/user.ts
export interface User {
  _id?: string;
  username: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}