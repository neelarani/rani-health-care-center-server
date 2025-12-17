import { UserRole } from '@prisma/client';
import express from 'express';
import * as controller from './schedule.controller';
import { checkAuth } from '@/app/middlewares';

const router = express.Router();

router.get(
  '/',
  checkAuth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT
  ),
  controller.schedulesForDoctor
);

router.post('/', checkAuth(UserRole.ADMIN), controller.insertIntoDB);

router.delete(
  '/:id',
  checkAuth(UserRole.ADMIN),
  controller.deleteScheduleFromDB
);

export default router;
