import { UserRole } from "@prisma/client";
import { Router } from "express";
import * as controller from "./review.controller";
import { checkAuth } from "@/app/middlewares";

const router = Router();

router.get("/", controller.getAllFromDB);
router.post("/", checkAuth(UserRole.PATIENT), controller.insertIntoDB);

export default router;
