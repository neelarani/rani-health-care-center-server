import { Router } from "express";
import { UserRole } from "@prisma/client";
import { checkAuth } from "@/app/middlewares";
import * as controller from "./patient.controller";

const router = Router();

router.get("/", controller.getAllFromDB);

router.get("/:id", controller.getByIdFromDB);

router.patch("/", checkAuth(UserRole.PATIENT), controller.updateIntoDB);

router.delete("/soft/:id", controller.softDelete);

export default router;
