import { catchAsync, pick, sendResponse } from "@/shared";
import * as service from "./schedule.service";

export const insertIntoDB = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Schedule created successfully!",
    data: await service.insertIntoDB(req.body),
  })
);

export const schedulesForDoctor = catchAsync(async (req, res) =>
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Schedule fetched successfully!",
    ...(await service.schedulesForDoctor(
      req.user,
      pick(req.query, ["startDateTime", "endDateTime"]),
      pick(req.query, ["page", "limit", "sortBy", "sortOrder"])
    )),
  })
);

export const deleteScheduleFromDB = catchAsync(async (req, res) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Schedule deleted successfully!",
    data: await service.deleteScheduleFromDB(req.params.id),
  });
});
