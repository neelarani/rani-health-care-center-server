import { Router } from "express";
import * as modules from "@/app/modules";

const moduleRoutes: Array<{ path: string; route: Router }> = [
  {
    path: "/user",
    route: modules.userRoutes,
  },
  {
    path: "/auth",
    route: modules.authRoutes,
  },
  {
    path: "/schedule",
    route: modules.scheduleRoutes,
  },
  {
    path: "/doctor-schedule",
    route: modules.doctorScheduleRoutes,
  },
  {
    path: "/specialties",
    route: modules.specialtiesRoutes,
  },
  {
    path: "/doctor",
    route: modules.doctorRoutes,
  },
  {
    path: "/admin",
    route: modules.adminRoutes,
  },
  {
    path: "/patient",
    route: modules.patientRoutes,
  },
  {
    path: "/appointment",
    route: modules.appointmentRoutes,
  },
  {
    path: "/prescription",
    route: modules.prescriptionRoutes,
  },
  {
    path: "/review",
    route: modules.reviewRoutes,
  },
  {
    path: "/metadata",
    route: modules.metaRoutes,
  },
];

export default moduleRoutes.reduce(
  (router, { path, route }) => router.use(path, route),
  Router()
);
