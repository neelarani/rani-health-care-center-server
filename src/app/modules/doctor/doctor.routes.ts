import { Router } from "express";
import { UserRole } from "@prisma/client";
import * as controller from "./doctor.controller";
import { checkAuth } from "@/app/middlewares";

const router = Router();

router.get("/", controller.getAllFromDB);

router.post("/suggestion", controller.getAISuggestions);

router.get("/:id", controller.getByIdFromDB);

router.patch(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.DOCTOR),
  controller.updateIntoDB
);

router.delete("/:id", checkAuth(UserRole.ADMIN), controller.deleteFromDB);

router.delete("/soft/:id", checkAuth(UserRole.ADMIN), controller.softDelete);

export default router;
