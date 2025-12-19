"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialtiesController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const specialties_service_1 = require("./specialties.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const insertIntoDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await specialties_service_1.SpecialtiesService.inserIntoDB(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Specialties created successfully!",
        data: result
    });
});
const getAllFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await specialties_service_1.SpecialtiesService.getAllFromDB(options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Specialties data fetched successfully",
        meta: result.meta,
        data: result.data,
    });
});
const deleteFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await specialties_service_1.SpecialtiesService.deleteFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Specialty deleted successfully',
        data: result,
    });
});
exports.SpecialtiesController = {
    insertIntoDB,
    getAllFromDB,
    deleteFromDB
};
