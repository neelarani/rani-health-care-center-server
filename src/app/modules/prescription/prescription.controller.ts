import httpStatus from "http-status";
import { catchAsync, pick, sendResponse } from "@/shared";
import * as service from "./prescription.service";

export const createPrescription = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "prescription created successfully!",
    data: await service.createPrescription(req.user, req.body),
  })
);

export const patientPrescription = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Prescription fetched successfully",
    ...(await service.patientPrescription(
      req.user,
      pick(req.query, ["limit", "page", "sortBy", "sortOrder"])
    )),
  })
);
