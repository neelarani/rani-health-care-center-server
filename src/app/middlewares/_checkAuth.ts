import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import { ApiError } from '@/app/errors';
import { catchAsync, verifyToken } from '@/shared';
import config from '@/config';
import { Request } from 'express';
import { UserRole } from '@prisma/client';

const checkAuth = (...roles: UserRole[]) => {
  return catchAsync(async (req: Request & { user?: any }, res, next) => {
    const token = req.headers.authorization || req.cookies.accessToken;

    if (!token)
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');

    const verifyUser = verifyToken(token, config.jwt.jwt_secret as Secret);

    req.user = {
      email: verifyUser.email,
      role: verifyUser.role as UserRole,
    };

    if (roles.length && !roles.includes(req.user.role))
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');

    next();
  });
};

export default checkAuth;
