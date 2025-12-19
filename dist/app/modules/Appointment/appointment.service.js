"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const uuid_1 = require("uuid");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const stripe_1 = require("../../../helpers/stripe");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const createAppointment = async (user, payload) => {
    const patientData = await prisma_1.default.patient.findUniqueOrThrow({
        where: {
            email: user?.email
        }
    });
    const doctorData = await prisma_1.default.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId,
            isDeleted: false
        }
    });
    await prisma_1.default.doctorSchedules.findFirstOrThrow({
        where: {
            doctorId: doctorData.id,
            scheduleId: payload.scheduleId,
            isBooked: false
        }
    });
    const videoCallingId = (0, uuid_1.v4)();
    const result = await prisma_1.default.$transaction(async (tnx) => {
        const appointmentData = await tnx.appointment.create({
            data: {
                patientId: patientData.id,
                doctorId: doctorData.id,
                scheduleId: payload.scheduleId,
                videoCallingId
            }
        });
        await tnx.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: doctorData.id,
                    scheduleId: payload.scheduleId
                }
            },
            data: {
                isBooked: true
            }
        });
        const transactionId = (0, uuid_1.v4)();
        const paymentData = await tnx.payment.create({
            data: {
                appointmentId: appointmentData.id,
                amount: doctorData.appointmentFee,
                transactionId
            }
        });
        const session = await stripe_1.stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: user?.email || '',
            line_items: [
                {
                    price_data: {
                        currency: "bdt",
                        product_data: {
                            name: `Appointment with ${doctorData.name}`,
                        },
                        unit_amount: doctorData.appointmentFee * 100,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                appointmentId: appointmentData.id,
                paymentId: paymentData.id
            },
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/my-appointments`,
        });
        return { paymentUrl: session.url };
    });
    return result;
};
const getMyAppointment = async (user, filters, options) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { ...filterData } = filters;
    const andConditions = [];
    if (user?.role === client_1.UserRole.PATIENT) {
        andConditions.push({
            patient: {
                email: user?.email
            }
        });
    }
    else if (user?.role === client_1.UserRole.DOCTOR) {
        andConditions.push({
            doctor: {
                email: user?.email
            }
        });
    }
    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map(key => ({
            [key]: {
                equals: filterData[key]
            }
        }));
        andConditions.push(...filterConditions);
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = await prisma_1.default.appointment.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: user?.role === client_1.UserRole.DOCTOR ?
            {
                patient: true,
                schedule: true,
                prescription: true,
                review: true,
                payment: true,
                doctor: {
                    include: {
                        doctorSpecialties: {
                            include: {
                                specialities: true
                            }
                        }
                    }
                }
            } : {
            doctor: {
                include: {
                    doctorSpecialties: {
                        include: {
                            specialities: true
                        }
                    }
                }
            },
            schedule: true,
            prescription: true,
            review: true,
            payment: true,
            patient: true
        }
    });
    const total = await prisma_1.default.appointment.count({
        where: whereConditions
    });
    return {
        meta: {
            total,
            limit,
            page
        },
        data: result
    };
};
// task get all data from db (appointment data) - admin
const updateAppointmentStatus = async (appointmentId, status, user) => {
    const appointmentData = await prisma_1.default.appointment.findUniqueOrThrow({
        where: {
            id: appointmentId
        },
        include: {
            doctor: true
        }
    });
    if (user?.role === client_1.UserRole.DOCTOR) {
        if (!(user?.email === appointmentData.doctor.email))
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "This is not your appointment");
    }
    return await prisma_1.default.appointment.update({
        where: {
            id: appointmentId
        },
        data: {
            status
        }
    });
};
const getAllFromDB = async (filters, options) => {
    const { limit, page, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { patientEmail, doctorEmail, ...filterData } = filters;
    const andConditions = [];
    if (patientEmail) {
        andConditions.push({
            patient: {
                email: patientEmail
            }
        });
    }
    else if (doctorEmail) {
        andConditions.push({
            doctor: {
                email: doctorEmail
            }
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                return {
                    [key]: {
                        equals: filterData[key]
                    }
                };
            })
        });
    }
    // console.dir(andConditions, { depth: Infinity })
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = await prisma_1.default.appointment.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                createdAt: 'desc',
            },
        include: {
            doctor: {
                include: {
                    doctorSpecialties: {
                        include: {
                            specialities: true
                        }
                    }
                }
            },
            patient: true,
            schedule: true,
            prescription: true,
            review: true,
            payment: true
        }
    });
    const total = await prisma_1.default.appointment.count({
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
const cancelUnpaidAppointments = async () => {
    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);
    const unPaidAppointments = await prisma_1.default.appointment.findMany({
        where: {
            createdAt: {
                lte: thirtyMinAgo
            },
            paymentStatus: client_1.PaymentStatus.UNPAID
        }
    });
    const appointmentIdsToCancel = unPaidAppointments.map(appointment => appointment.id);
    await prisma_1.default.$transaction(async (tnx) => {
        // Update appointments to CANCELED status instead of deleting
        await tnx.appointment.updateMany({
            where: {
                id: {
                    in: appointmentIdsToCancel
                }
            },
            data: {
                status: client_1.AppointmentStatus.CANCELED
            }
        });
        // Delete associated payments
        await tnx.payment.deleteMany({
            where: {
                appointmentId: {
                    in: appointmentIdsToCancel
                }
            }
        });
        // Free up doctor schedules
        for (const unPaidAppointment of unPaidAppointments) {
            await tnx.doctorSchedules.update({
                where: {
                    doctorId_scheduleId: {
                        doctorId: unPaidAppointment.doctorId,
                        scheduleId: unPaidAppointment.scheduleId
                    }
                },
                data: {
                    isBooked: false
                }
            });
        }
    });
};
const createAppointmentWithPayLater = async (user, payload) => {
    const patientData = await prisma_1.default.patient.findUniqueOrThrow({
        where: {
            email: user?.email
        }
    });
    const doctorData = await prisma_1.default.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId,
            isDeleted: false
        }
    });
    await prisma_1.default.doctorSchedules.findFirstOrThrow({
        where: {
            doctorId: doctorData.id,
            scheduleId: payload.scheduleId,
            isBooked: false
        }
    });
    const videoCallingId = (0, uuid_1.v4)();
    const result = await prisma_1.default.$transaction(async (tnx) => {
        const appointmentData = await tnx.appointment.create({
            data: {
                patientId: patientData.id,
                doctorId: doctorData.id,
                scheduleId: payload.scheduleId,
                videoCallingId
            },
            include: {
                patient: true,
                doctor: true,
                schedule: true
            }
        });
        await tnx.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: doctorData.id,
                    scheduleId: payload.scheduleId
                }
            },
            data: {
                isBooked: true
            }
        });
        const transactionId = (0, uuid_1.v4)();
        await tnx.payment.create({
            data: {
                appointmentId: appointmentData.id,
                amount: doctorData.appointmentFee,
                transactionId
            }
        });
        return appointmentData;
    });
    return result;
};
const initiatePaymentForAppointment = async (appointmentId, user) => {
    const patientData = await prisma_1.default.patient.findUniqueOrThrow({
        where: {
            email: user?.email
        }
    });
    const appointment = await prisma_1.default.appointment.findUnique({
        where: {
            id: appointmentId,
            patientId: patientData.id
        },
        include: {
            payment: true,
            doctor: true
        }
    });
    if (!appointment) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Appointment not found or unauthorized");
    }
    if (appointment.paymentStatus !== client_1.PaymentStatus.UNPAID) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Payment already completed for this appointment");
    }
    if (appointment.status === client_1.AppointmentStatus.CANCELED) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Cannot pay for cancelled appointment");
    }
    // Create Stripe checkout session
    const session = await stripe_1.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: user?.email || '',
        line_items: [
            {
                price_data: {
                    currency: "bdt",
                    product_data: {
                        name: `Appointment with ${appointment.doctor.name}`,
                    },
                    unit_amount: appointment.payment.amount * 100,
                },
                quantity: 1,
            },
        ],
        metadata: {
            appointmentId: appointment.id,
            paymentId: appointment.payment.id
        },
        success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/my-appointments`,
    });
    return { paymentUrl: session.url };
};
exports.AppointmentService = {
    createAppointment,
    getMyAppointment,
    updateAppointmentStatus,
    getAllFromDB,
    cancelUnpaidAppointments,
    createAppointmentWithPayLater,
    initiatePaymentForAppointment
};
