import httpStatus from "http-status";
import * as constants from "./review.constant";
import * as service from "./review.service";
import { catchAsync, pick, sendResponse } from "@/shared";

export const insertIntoDB = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review created successfully",
    data: await service.insertIntoDB(req.user, req.body),
  })
);

export const getAllFromDB = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews retrieval successfully",
    ...(await service.getAllFromDB(
      pick(req.query, constants.reviewFilterableFields),
      pick(req.query, ["limit", "page", "sortBy", "sortOrder"])
    )),
  })
);
