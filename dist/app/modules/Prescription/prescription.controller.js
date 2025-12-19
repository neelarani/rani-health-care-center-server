"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const prescription_service_1 = require("./prescription.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const prescription_constants_1 = require("./prescription.constants");
const insertIntoDB = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await prescription_service_1.PrescriptionService.insertIntoDB(user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Prescription created successfully',
        data: result,
    });
});
const patientPrescription = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await prescription_service_1.PrescriptionService.patientPrescription(user, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Prescription fetched successfully',
        meta: result.meta,
        data: result.data
    });
});
const getAllFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, prescription_constants_1.prescriptionFilterableFields);
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await prescription_service_1.PrescriptionService.getAllFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Prescriptions retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});
exports.PrescriptionController = {
    insertIntoDB,
    patientPrescription,
    getAllFromDB
};
