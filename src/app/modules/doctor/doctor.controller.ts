import { catchAsync, pick, sendResponse } from "@/shared";
import * as service from "./doctor.service";
import * as constants from "./doctor.constant";

export const getAllFromDB = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor fetched successfully!",
    ...(await service.getAllFromDB(
      pick(req.query, constants.doctorFilterableFields),
      pick(req.query, ["page", "limit", "sortBy", "sortOrder"])
    )),
  })
);

export const updateIntoDB = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor updated successfully!",
    data: await service.updateIntoDB(req.params.id, req.body),
  })
);

export const getByIdFromDB = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor retrieval successfully",
    data: await service.getByIdFromDB(req.params.id),
  })
);

export const deleteFromDB = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor deleted successfully",
    data: await service.deleteFromDB(req.params.id),
  })
);

export const softDelete = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor soft deleted successfully",
    data: await service.softDelete(req.params.id),
  })
);

export const getAISuggestions = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "AI suggestions fetched successfully",
    data: await service.getAISuggestions(req.body),
  })
);
