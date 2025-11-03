import httpStatus from "http-status";
import * as service from "./specialties.service";
import { catchAsync, sendResponse } from "@/shared";

export const insertIntoDB = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialties created successfully!",
    data: await service.insertIntoDB(req),
  })
);

export const getAllFromDB = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialties data fetched successfully",
    data: await service.getAllFromDB(),
  })
);

export const deleteFromDB = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialty deleted successfully",
    data: await service.deleteFromDB(req.params.id),
  })
);
