"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorScheduleService = void 0;
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const insertIntoDB = async (user, payload) => {
    const doctorData = await prisma_1.default.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });
    const doctorScheduleData = payload.scheduleIds.map(scheduleId => ({
        doctorId: doctorData.id,
        scheduleId
    }));
    const result = await prisma_1.default.doctorSchedules.createMany({
        data: doctorScheduleData
    });
    return result;
};
const getMySchedule = async (filters, options, user) => {
    const { limit, page, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { startDate, endDate, ...filterData } = filters;
    const andConditions = [];
    if (startDate && endDate) {
        andConditions.push({
            AND: [
                {
                    schedule: {
                        startDateTime: {
                            gte: startDate
                        }
                    }
                },
                {
                    schedule: {
                        endDateTime: {
                            lte: endDate
                        }
                    }
                }
            ]
        });
    }
    ;
    if (Object.keys(filterData).length > 0) {
        if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'true') {
            filterData.isBooked = true;
        }
        else if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'false') {
            filterData.isBooked = false;
        }
        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                return {
                    [key]: {
                        equals: filterData[key],
                    },
                };
            }),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = await prisma_1.default.doctorSchedules.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {}
    });
    const total = await prisma_1.default.doctorSchedules.count({
        where: whereConditions
    });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};
const deleteFromDB = async (user, scheduleId) => {
    const doctorData = await prisma_1.default.doctor.findUniqueOrThrow({
        where: {
            email: user?.email
        }
    });
    const isBookedSchedule = await prisma_1.default.doctorSchedules.findFirst({
        where: {
            doctorId: doctorData.id,
            scheduleId: scheduleId,
            isBooked: true
        }
    });
    if (isBookedSchedule) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You can not delete the schedule because of the schedule is already booked!");
    }
    const result = await prisma_1.default.doctorSchedules.delete({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorData.id,
                scheduleId: scheduleId
            }
        }
    });
    return result;
};
const getAllFromDB = async (filters, options) => {
    const { limit, page, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            doctor: {
                name: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            },
        });
    }
    if (Object.keys(filterData).length > 0) {
        if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'true') {
            filterData.isBooked = true;
        }
        else if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'false') {
            filterData.isBooked = false;
        }
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = await prisma_1.default.doctorSchedules.findMany({
        include: {
            doctor: true,
            schedule: true,
        },
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {},
    });
    const total = await prisma_1.default.doctorSchedules.count({
        where: whereConditions,
    });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};
exports.DoctorScheduleService = {
    insertIntoDB,
    getMySchedule,
    deleteFromDB,
    getAllFromDB
};
