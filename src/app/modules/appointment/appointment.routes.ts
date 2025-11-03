import { Router } from "express";
import { UserRole } from "@prisma/client";
import { checkAuth } from "@/app/middlewares";
import * as controller from "./appointment.controller";

const router = Router();

router.get("/", checkAuth(UserRole.ADMIN), controller.getAllFromDB);

router.get(
  "/my-appointments",
  checkAuth(UserRole.PATIENT, UserRole.DOCTOR),
  controller.getMyAppointment
);

router.post("/", checkAuth(UserRole.PATIENT), controller.createAppointment);

router.patch(
  "/status/:id",
  checkAuth(UserRole.ADMIN, UserRole.DOCTOR),
  controller.updateAppointmentStatus
);

export default router;
