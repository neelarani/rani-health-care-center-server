"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorController = void 0;
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const doctor_service_1 = require("./doctor.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const doctor_constants_1 = require("./doctor.constants");
const getAllFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, doctor_constants_1.doctorFilterableFields);
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await doctor_service_1.DoctorService.getAllFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Doctors retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});
const getByIdFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await doctor_service_1.DoctorService.getByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Doctor retrieval successfully',
        data: result,
    });
});
const updateIntoDB = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await doctor_service_1.DoctorService.updateIntoDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Doctor data updated!",
        data: result
    });
});
const deleteFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await doctor_service_1.DoctorService.deleteFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Doctor deleted successfully',
        data: result,
    });
});
const softDelete = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await doctor_service_1.DoctorService.softDelete(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Doctor soft deleted successfully',
        data: result,
    });
});
const getAiSuggestion = (0, catchAsync_1.default)(async (req, res) => {
    const { symptoms } = req.body;
    // Basic validation
    if (!symptoms || typeof symptoms !== 'string' || symptoms.trim().length < 5) {
        return res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: 'Please provide valid symptoms for doctor suggestion (minimum 5 characters).',
        });
    }
    const result = await doctor_service_1.DoctorService.getAISuggestion({ symptoms: symptoms.trim() });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'AI doctor suggestions retrieved successfully',
        data: result,
    });
});
exports.DoctorController = {
    updateIntoDB,
    getAllFromDB,
    getByIdFromDB,
    deleteFromDB,
    softDelete,
    getAiSuggestion,
};
