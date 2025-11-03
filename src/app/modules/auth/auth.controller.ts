import httpStatus from "http-status";
import * as service from "./auth.service";
import { catchAsync, sendResponse } from "@/shared";

export const login = catchAsync(async (req, res) => {
  const { accessToken, refreshToken, needPasswordChange } = await service.login(
    req.body
  );

  res.cookie("accessToken", accessToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60,
  });
  res.cookie("refreshToken", refreshToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 90,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User loggedin successfully!",
    data: {
      needPasswordChange,
    },
  });
});

export const refreshToken = catchAsync(async (req, res) => {
  const { accessToken } = await service.refreshToken(req.cookies.refreshToken);

  res.cookie("accessToken", accessToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token genereated successfully!",
    data: { accessToken },
  });
});

export const changePassword = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password Changed successfully",
    data: await service.changePassword(req.user, req.body),
  })
);

export const forgotPassword = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Check your email!",
    data: await service.forgotPassword(req.body),
  })
);

export const resetPassword = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password Reset!",
    data: await service.resetPassword(
      req.headers.authorization || "",
      req.body
    ),
  })
);

export const getMe = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieve successfully!",
    data: await service.getMe(req.cookies),
  })
);
