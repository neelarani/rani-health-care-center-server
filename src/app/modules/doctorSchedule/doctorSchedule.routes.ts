import { UserRole } from "@prisma/client";
import { Router } from "express";
import * as controller from "./doctorSchedule.controller";
import { checkAuth, validateRequest } from "@/app/middlewares";
import * as validation from "./doctorSchedule.validation";

const router = Router();
router.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  controller.getAllFromDB
);

router.get(
  "/my-schedule",
  checkAuth(UserRole.DOCTOR),
  controller.getMySchedule
);

router.post(
  "/",
  checkAuth(UserRole.DOCTOR),
  validateRequest(validation.createDoctorScheduleValidationSchema),
  controller.insertIntoDB
);

router.delete("/:id", checkAuth(UserRole.DOCTOR), controller.deleteFromDB);

export default router;
