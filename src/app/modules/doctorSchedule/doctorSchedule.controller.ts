import httpStatus from "http-status";
import * as constants from "./doctorSchedule.constant";
import * as service from "./doctorSchedule.service";
import { catchAsync, pick, sendResponse } from "@/shared";

export const insertIntoDB = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Doctor Schedule created successfully!",
    data: await service.insertIntoDB(req.user, req.body),
  })
);

export const getMySchedule = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My Schedule fetched successfully!",
    data: await service.getMySchedule(
      pick(req.query, ["startDate", "endDate", "isBooked"]),
      pick(req.query, ["limit", "page", "sortBy", "sortOrder"]),
      req.user
    ),
  })
);

export const deleteFromDB = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My Schedule deleted successfully!",
    data: await service.deleteFromDB(req.user, req.params.id),
  })
);

export const getAllFromDB = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor Schedule retrieval successfully",
    ...(await service.getAllFromDB(
      pick(req.query, constants.scheduleFilterableFields),
      pick(req.query, ["limit", "page", "sortBy", "sortOrder"])
    )),
  })
);
