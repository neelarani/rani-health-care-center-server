import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import { ApiError } from '@/app/errors';
import { catchAsync, verifyToken } from '@/shared';
import config from '@/config';

const checkAuth = (...roles: string[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token)
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');

    const verifyUser = verifyToken(token, config.jwt.jwt_secret as Secret);

    req.user = verifyUser;

    if (roles.length && !roles.includes(verifyUser.role))
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');

    next();
  });
};

export default checkAuth;
