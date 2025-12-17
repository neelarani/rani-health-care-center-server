import httpStatus from 'http-status';
import { catchAsync, pick, sendResponse } from '@/shared';
import * as service from './appointment.service';
import { IAuthUser } from '@/interface/common';
import { Request } from 'express';
import { appointmentFilterableFields } from './appointment.constant';

export const createAppointment = catchAsync(async (req: Request, res) => {
  const user = req.user;

  const result = await service.createAppointment(user as IAuthUser, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Appointment booked successfully!',
    data: result,
  });
});

export const getMyAppointment = catchAsync(async (req: Request, res) => {
  const user = req.user;
  const filters = pick(req.query, ['status', 'paymentStatus']);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await service.getMyAppointment(
    user as IAuthUser,
    filters,
    options
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My Appointment retrive successfully',
    data: result.data,
    meta: result.meta,
  });
});

export const getAllFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, appointmentFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await service.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Appointment retrieval successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const changeAppointmentStatus = catchAsync(async (req: Request, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const user = req.user;

  const result = await service.updateAppointmentStatus(
    id,
    status,
    user as IAuthUser
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Appointment status changed successfully',
    data: result,
  });
});

export const createAppointmentWithPayLater = catchAsync(
  async (req: Request, res) => {
    const user = req.user;

    const result = await service.createAppointmentWithPayLater(
      user as IAuthUser,
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Appointment booked successfully! You can pay later.',
      data: result,
    });
  }
);

export const initiatePayment = catchAsync(async (req: Request, res) => {
  const user = req.user;
  const { id } = req.params;

  const result = await service.initiatePaymentForAppointment(
    id,
    user as IAuthUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment session created successfully',
    data: result,
  });
});
