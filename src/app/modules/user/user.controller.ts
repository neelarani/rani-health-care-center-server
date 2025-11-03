import { userFilterableFields } from "./user.constant";
import httpStatus from "http-status";
import { catchAsync, pick, sendResponse } from "@/shared";
import * as service from "./user.service";

export const createPatient = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Patient created successfully!",
    data: await service.createPatient(req),
  })
);

export const createAdmin = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Admin Created successfully!",
    data: await service.createAdmin(req),
  })
);

export const createDoctor = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Doctor Created successfully!",
    data: await service.createDoctor(req),
  })
);

export const getAllFromDB = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User retrive successfully!",
    ...(await service.getAllFromDB(
      pick(req.query, userFilterableFields),
      pick(req.query, ["page", "limit", "sortBy", "sortOrder"])
    )),
  })
);

export const getMyProfile = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My profile data fetched!",
    data: await service.getMyProfile(req.user),
  })
);

export const changeProfileStatus = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users profile status changed!",
    data: await service.changeProfileStatus(req.params.id, req.body),
  })
);

export const updateMyProfile = catchAsync(async (req, res) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My profile updated!",
    data: await service.updateMyProfile(req),
  });
});
