import httpStatus from "http-status";
import { catchAsync, pick, sendResponse } from "@/shared";
import * as constants from "./appointment.constant";
import * as service from "./appointment.service";

export const createAppointment = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Appointment created successfully!",
    data: await service.createAppointment(req.user, req.body),
  })
);

export const getMyAppointment = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Appointment fetched successfully!",
    data: await service.getMyAppointment(
      req.user,
      pick(req.query, ["status", "paymentStatus"]),
      pick(req.query, ["page", "limit", "sortBy", "sortOrder"])
    ),
  })
);

export const updateAppointmentStatus = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Appointment updated successfully!",
    data: await service.updateAppointmentStatus(
      req.params.id,
      req.body.status,
      req.user
    ),
  })
);

export const getAllFromDB = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointment retrieval successfully",
    ...(await service.getAllFromDB(
      pick(req.query, constants.appointmentFilterableFields),
      pick(req.query, ["limit", "page", "sortBy", "sortOrder"])
    )),
  })
);
