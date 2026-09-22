export interface JwtPayload {
  sub: string;
  userEmail: string;
}

export interface AuthenticatedUser {
  userId: string;
  userEmail: string;
  userName: string;
  roles: string[];
}
