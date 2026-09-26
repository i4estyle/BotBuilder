export interface JwtPayload {
  sub: string;
}

export interface AuthenticatedUser {
  userId: string;
  userEmail: string | null;
  userName: string;
  roles: string[];
}
