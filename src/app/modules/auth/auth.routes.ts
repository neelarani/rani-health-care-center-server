import { UserRole } from '@prisma/client';
import * as controller from './auth.controller';
import { checkAuth } from '@/app/middlewares';
import { NextFunction, Request, Response, Router } from 'express';
import { authLimiter } from '@/app/middlewares/rateLimiter';

const router = Router();

router.post('/login', authLimiter, controller.login);

router.post('/refresh-token', controller.refreshToken);

router.post(
  '/change-password',
  checkAuth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT
  ),
  controller.changePassword
);

router.post('/forgot-password', controller.forgotPassword);

router.post(
  '/reset-password',
  (req: Request, res: Response, next: NextFunction) => {
    //user is resetting password without token and logged in newly created admin or doctor
    if (!req.headers.authorization && req.cookies.accessToken) {
      console.log(req.headers.authorization, 'from reset password route guard');
      console.log(req.cookies.accessToken, 'from reset password route guard');
      checkAuth(
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.DOCTOR,
        UserRole.PATIENT
      )(req, res, next);
    } else {
      //user is resetting password via email link with token
      next();
    }
  },
  controller.resetPassword
);

router.get('/me', controller.getMe);

export default router;
