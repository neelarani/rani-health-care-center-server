import httpStatus from "http-status";
import { catchAsync, pick, sendResponse } from "@/shared";
import * as constants from "./admin.constant";
import * as service from "./admin.service";

export const getAllFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, constants.adminFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await service.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin data fetched!",
    meta: result.meta,
    data: result.data,
  });
});

export const getByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await service.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin data fetched by id!",
    data: result,
  });
});

export const updateIntoDB = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await service.updateIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin data updated!",
    data: result,
  });
});

export const deleteFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await service.deleteFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin data deleted!",
    data: result,
  });
});

export const softDeleteFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await service.softDeleteFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin data deleted!",
    data: result,
  });
});
