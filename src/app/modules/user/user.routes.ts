import { UserRole } from '@prisma/client';
import { checkAuth, validateRequest } from '@/app/middlewares';
import { fileUploader } from '@/shared';
import * as controller from './user.controller';
import * as validation from './user.validation';
import { Router } from 'express';

const router = Router();

router.get('/', checkAuth(UserRole.ADMIN), controller.getAllFromDB);

router.get(
  '/me',
  checkAuth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  controller.getMyProfile
);

router.post(
  '/create-patient',
  fileUploader.upload.single('file'),
  validateRequest(validation.createPatientValidationSchema),
  controller.createPatient
);

router.post(
  '/create-admin',
  checkAuth(UserRole.ADMIN),
  fileUploader.upload.single('file'),
  validateRequest(validation.createAdminValidationSchema),
  controller.createAdmin
);

router.post(
  '/create-doctor',
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = validation.createDoctorValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return controller.createDoctor(req, res, next);
  }
);

router.patch(
  '/:id/status',
  checkAuth(UserRole.ADMIN),
  controller.changeProfileStatus
);

router.patch(
  '/update-my-profile',
  checkAuth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  fileUploader.upload.single('file'),
  controller.updateMyProfile
);

export default router;
