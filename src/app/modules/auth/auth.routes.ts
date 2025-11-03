import { UserRole } from "@prisma/client";
import * as controller from "./auth.controller";
import { checkAuth } from "@/app/middlewares";
import { Router } from "express";

const router = Router();

router.get("/me", controller.getMe);

router.post("/login", controller.login);

router.post("/refresh-token", controller.refreshToken);

router.post(
  "/change-password",
  checkAuth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  controller.changePassword
);

router.post("/forgot-password", controller.forgotPassword);

router.post("/reset-password", controller.resetPassword);

export default router;
