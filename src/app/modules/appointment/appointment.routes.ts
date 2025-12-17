import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { checkAuth, validateRequest } from '@/app/middlewares';
import * as controller from './appointment.controller';
import * as validation from './appointment.validation';
import { paymentLimiter } from '@/app/middlewares/rateLimiter';

const router = Router();

router.get(
  '/',
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  controller.getAllFromDB
);

router.get(
  '/my-appointment',
  checkAuth(UserRole.PATIENT, UserRole.DOCTOR),
  controller.getMyAppointment
);

router.post(
  '/',
  checkAuth(UserRole.PATIENT),
  paymentLimiter,
  validateRequest(validation.createAppointment),
  controller.createAppointment
);

router.post(
  '/pay-later',
  checkAuth(UserRole.PATIENT),
  validateRequest(validation.createAppointment),
  controller.createAppointmentWithPayLater
);

router.post(
  '/:id/initiate-payment',
  checkAuth(UserRole.PATIENT),
  paymentLimiter,
  controller.initiatePayment
);

router.patch(
  '/status/:id',
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  controller.changeAppointmentStatus
);

router.post(
  '/pay-later',
  checkAuth(UserRole.PATIENT),
  controller.createAppointmentWithPayLater
);

export default router;
