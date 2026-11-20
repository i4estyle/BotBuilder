export type AdminAccountStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface AdminAccount {
  adminId: string;
  loginName: string;
  displayName: string;
  email: string;
  status: AdminAccountStatus;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface CreateAdminAccountPayload {
  loginName: string;
  displayName: string;
  email: string;
  password: string;
}

export interface UpdateAdminAccountPayload {
  displayName?: string;
  email?: string;
}
