import { Router } from "express";
import { UserRole } from "@prisma/client";
import { checkAuth, validateRequest } from "@/app/middlewares";
import * as validation from "./admin.validations";
import * as controller from "./admin.controller";

const router = Router();

router.get("/", checkAuth(UserRole.ADMIN), controller.getAllFromDB);

router.get("/:id", checkAuth(UserRole.ADMIN), controller.getByIdFromDB);

router.patch(
  "/:id",
  checkAuth(UserRole.ADMIN),
  validateRequest(validation.update),
  controller.updateIntoDB
);

router.delete("/:id", checkAuth(UserRole.ADMIN), controller.deleteFromDB);

router.delete(
  "/soft/:id",
  checkAuth(UserRole.ADMIN),
  controller.softDeleteFromDB
);

export default router;
