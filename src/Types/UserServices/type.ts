import { Service } from '@/src/Types/Services/index';

export interface UserService {
  user_id: number;
  service_id: number;
  subscription_date: Date;
  is_active: boolean;
  can_write: boolean;
  can_delete: boolean;
}

export interface UserServiceWithDetails extends UserService {
  service: Service;
}

export type AssignServiceToUser = Omit<UserService, 'subscription_date' | 'is_active' | 'can_write' | 'can_delete'> & {
  is_active?: boolean;
  can_write?: boolean;
  can_delete?: boolean;
};

export type UpdateUserServicePermissions = {
  is_active?: boolean;
  can_write?: boolean;
  can_delete?: boolean;
};

export type CreateUserService = Omit<UserService, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserService = Partial<CreateUserService>;
