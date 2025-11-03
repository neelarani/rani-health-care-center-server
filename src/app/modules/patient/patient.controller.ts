import httpStatus from "http-status";
import { catchAsync, pick, sendResponse } from "@/shared";
import * as constants from "./patient.constant";
import * as service from "./patient.service";

export const getAllFromDB = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient retrieval successfully",
    ...(await service.getAllFromDB(
      pick(req.query, constants.patientFilterableFields),
      pick(req.query, ["limit", "page", "sortBy", "sortOrder"])
    )),
  })
);

export const getByIdFromDB = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient retrieval successfully",
    data: await service.getByIdFromDB(req.params.id),
  })
);

export const softDelete = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient soft deleted successfully",
    data: await service.softDelete(req.params.id),
  })
);

export const updateIntoDB = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient updated successfully",
    data: await service.updateIntoDB(req.user, req.body),
  })
);
