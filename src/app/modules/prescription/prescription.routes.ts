import { UserRole } from "@prisma/client";
import { checkAuth } from "@/app/middlewares";
import { Router } from "express";
import * as controller from "./prescription.controller";

const router = Router();

router.get(
  "/my-prescription",
  checkAuth(UserRole.PATIENT),
  controller.patientPrescription
);

router.post("/", checkAuth(UserRole.DOCTOR), controller.createPrescription);

export default router;
