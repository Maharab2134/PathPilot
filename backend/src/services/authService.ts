import jwt, { Secret } from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export class AuthService {
  static generateTokens(payload: TokenPayload) {
    const accessSecret: Secret = (process.env.JWT_ACCESS_SECRET ||
      '') as Secret;
    const refreshSecret: Secret = (process.env.JWT_REFRESH_SECRET ||
      '') as Secret;

    const accessToken = (jwt as any).sign(payload, accessSecret, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    });

    const refreshToken = (jwt as any).sign(payload, refreshSecret, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });

    return { accessToken, refreshToken };
  }

  static verifyAccessToken(token: string): TokenPayload {
    return (jwt as any).verify(
      token,
      process.env.JWT_ACCESS_SECRET!
    ) as TokenPayload;
  }

  static verifyRefreshToken(token: string): TokenPayload {
    return (jwt as any).verify(
      token,
      process.env.JWT_REFRESH_SECRET!
    ) as TokenPayload;
  }

  static async findUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email: email.toLowerCase() });
  }

  static async createUser(userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<IUser> {
    const user = new User({
      name: userData.name,
      email: userData.email.toLowerCase(),
      passwordHash: userData.password,
      role: userData.role || 'user',
    });

    return user.save();
  }
}
