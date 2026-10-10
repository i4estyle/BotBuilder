export interface AdminAccount {
  adminId: string;
  loginName: string;
  displayName: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface CreateAdminAccountPayload {
  loginName: string;
  displayName: string;
  email: string;
  password: string;
}
