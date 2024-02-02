export type JwtPayload = {
  email: string;
  roles: string;
  sub: number;
};

export type JwtPayloadRefresh = JwtPayload & { refreshToken: string };
