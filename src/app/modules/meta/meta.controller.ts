import httpStatus from "http-status";
import { catchAsync, sendResponse } from "@/shared";
import * as service from "./meta.service";

export const fetchDashboardMetaData = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Meta data retrieved successfully!",
    data: await service.fetchDashboardMetaData(req.user),
  })
);
