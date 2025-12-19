"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialtiesService = void 0;
const fileUploader_1 = require("../../../helpers/fileUploader");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const inserIntoDB = async (req) => {
    const file = req.file;
    if (file) {
        const uploadToCloudinary = await fileUploader_1.fileUploader.uploadToCloudinary(file);
        req.body.icon = uploadToCloudinary?.secure_url;
    }
    const result = await prisma_1.default.specialties.create({
        data: req.body
    });
    return result;
};
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const getAllFromDB = async (options) => {
    const { limit, page, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const result = await prisma_1.default.specialties.findMany({
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: "desc" },
    });
    const total = await prisma_1.default.specialties.count();
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};
const deleteFromDB = async (id) => {
    const result = await prisma_1.default.specialties.delete({
        where: {
            id,
        },
    });
    return result;
};
exports.SpecialtiesService = {
    inserIntoDB,
    getAllFromDB,
    deleteFromDB
};
