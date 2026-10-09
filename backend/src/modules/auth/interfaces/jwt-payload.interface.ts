export interface JwtPayload {
  sub: string;
  ver: number;
}

export interface AuthenticatedAdmin {
  adminId: string;
  email: string;
  displayName: string;
}
