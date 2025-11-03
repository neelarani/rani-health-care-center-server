import { UserRole } from "@prisma/client";
import { Router } from "express";
import * as controller from "./specialties.controller";
import { fileUploader } from "@/shared";
import { checkAuth } from "@/app/middlewares";

const router = Router();

router.get("/", controller.getAllFromDB);

router.post("/", fileUploader.upload.single("file"), controller.insertIntoDB);

router.delete(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.ADMIN),
  controller.deleteFromDB
);

export default router;
