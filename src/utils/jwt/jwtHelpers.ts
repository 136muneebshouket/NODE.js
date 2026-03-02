// @ts-ignore
import jwt, { JwtPayload } from 'jsonwebtoken';
// import env from '../../../../src/config/env_config';
type User = {
  id: string | number;
  email: string;
};

const ACCESS_EXP = '30m';
const REFRESH_EXP = '30d';

const ACCESS_SECRET = 'env.jwt.secretAccessKey as string';
const REFRESH_SECRET = 'env.jwt.secretRefreshKey as string';

export function signAccessToken(user: User): string {
  return jwt.sign(user, ACCESS_SECRET, { expiresIn: ACCESS_EXP });
}

export function signRefreshToken(user: Pick<User, 'id'>): string {
  return jwt.sign(user, REFRESH_SECRET, { expiresIn: REFRESH_EXP });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
}

export { ACCESS_EXP, REFRESH_EXP };
