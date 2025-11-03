import { UserRole } from "@prisma/client";
import { checkAuth } from "@/app/middlewares";
import * as controller from "./meta.controller";
import { Router } from "express";

const router = Router();

router.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  controller.fetchDashboardMetaData
);

export default router;
