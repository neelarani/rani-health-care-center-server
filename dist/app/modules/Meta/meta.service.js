"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const fetchDashboardMetaData = async (user) => {
    let metaData;
    switch (user?.role) {
        case client_1.UserRole.SUPER_ADMIN:
            metaData = getSuperAdminMetaData();
            break;
        case client_1.UserRole.ADMIN:
            metaData = getAdminMetaData();
            break;
        case client_1.UserRole.DOCTOR:
            metaData = getDoctorMetaData(user);
            break;
        case client_1.UserRole.PATIENT:
            metaData = getPatientMetaData(user);
            break;
        default:
            throw new Error('Invalid user role!');
    }
    return metaData;
};
const getSuperAdminMetaData = async () => {
    const appointmentCount = await prisma_1.default.appointment.count();
    const patientCount = await prisma_1.default.patient.count();
    const doctorCount = await prisma_1.default.doctor.count();
    const adminCount = await prisma_1.default.admin.count();
    const paymentCount = await prisma_1.default.payment.count();
    const totalRevenue = await prisma_1.default.payment.aggregate({
        _sum: { amount: true },
        where: {
            status: client_1.PaymentStatus.PAID
        }
    });
    const barChartData = await getBarChartData();
    const pieCharData = await getPieChartData();
    return { appointmentCount, patientCount, doctorCount, adminCount, paymentCount, totalRevenue, barChartData, pieCharData };
};
const getAdminMetaData = async () => {
    const appointmentCount = await prisma_1.default.appointment.count();
    const patientCount = await prisma_1.default.patient.count();
    const doctorCount = await prisma_1.default.doctor.count();
    const paymentCount = await prisma_1.default.payment.count();
    const totalRevenue = await prisma_1.default.payment.aggregate({
        _sum: { amount: true },
        where: {
            status: client_1.PaymentStatus.PAID
        }
    });
    const barChartData = await getBarChartData();
    const pieCharData = await getPieChartData();
    return { appointmentCount, patientCount, doctorCount, paymentCount, totalRevenue, barChartData, pieCharData };
};
const getDoctorMetaData = async (user) => {
    const doctorData = await prisma_1.default.doctor.findUniqueOrThrow({
        where: {
            email: user?.email
        }
    });
    const appointmentCount = await prisma_1.default.appointment.count({
        where: {
            doctorId: doctorData.id
        }
    });
    const patientCount = await prisma_1.default.appointment.groupBy({
        by: ['patientId'],
        _count: {
            id: true
        }
    });
    const reviewCount = await prisma_1.default.review.count({
        where: {
            doctorId: doctorData.id
        }
    });
    const totalRevenue = await prisma_1.default.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            appointment: {
                doctorId: doctorData.id
            },
            status: client_1.PaymentStatus.PAID
        }
    });
    const appointmentStatusDistribution = await prisma_1.default.appointment.groupBy({
        by: ['status'],
        _count: { id: true },
        where: {
            doctorId: doctorData.id
        }
    });
    const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ status, _count }) => ({
        status,
        count: Number(_count.id)
    }));
    return {
        appointmentCount,
        reviewCount,
        patientCount: patientCount.length,
        totalRevenue,
        formattedAppointmentStatusDistribution
    };
};
const getPatientMetaData = async (user) => {
    const patientData = await prisma_1.default.patient.findUniqueOrThrow({
        where: {
            email: user?.email
        }
    });
    const appointmentCount = await prisma_1.default.appointment.count({
        where: {
            patientId: patientData.id
        }
    });
    const prescriptionCount = await prisma_1.default.prescription.count({
        where: {
            patientId: patientData.id
        }
    });
    const reviewCount = await prisma_1.default.review.count({
        where: {
            patientId: patientData.id
        }
    });
    const appointmentStatusDistribution = await prisma_1.default.appointment.groupBy({
        by: ['status'],
        _count: { id: true },
        where: {
            patientId: patientData.id
        }
    });
    const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ status, _count }) => ({
        status,
        count: Number(_count.id)
    }));
    return {
        appointmentCount,
        prescriptionCount,
        reviewCount,
        formattedAppointmentStatusDistribution
    };
};
const getBarChartData = async () => {
    const appointmentCountByMonth = await prisma_1.default.$queryRaw `
        SELECT DATE_TRUNC('month', "createdAt") AS month,
        CAST(COUNT(*) AS INTEGER) AS count
        FROM "appointments"
        GROUP BY month
        ORDER BY month ASC
    `;
    return appointmentCountByMonth;
};
const getPieChartData = async () => {
    const appointmentStatusDistribution = await prisma_1.default.appointment.groupBy({
        by: ['status'],
        _count: { id: true }
    });
    const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ status, _count }) => ({
        status,
        count: Number(_count.id)
    }));
    return formattedAppointmentStatusDistribution;
};
exports.MetaService = {
    fetchDashboardMetaData
};
