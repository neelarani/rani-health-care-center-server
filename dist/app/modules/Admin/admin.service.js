"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const client_1 = require("@prisma/client");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const admin_constant_1 = require("./admin.constant");
const getAllFromDB = async (params, options) => {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;
    const andConditions = [];
    if (params.searchTerm) {
        andConditions.push({
            OR: admin_constant_1.adminSearchAbleFields.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }
    ;
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        });
    }
    ;
    andConditions.push({
        isDeleted: false
    });
    //console.dir(andConditions, { depth: 'inifinity' })
    const whereConditions = { AND: andConditions };
    const result = await prisma_1.default.admin.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    });
    const total = await prisma_1.default.admin.count({
        where: whereConditions
    });
    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
};
const getByIdFromDB = async (id) => {
    const result = await prisma_1.default.admin.findUnique({
        where: {
            id,
            isDeleted: false
        }
    });
    return result;
};
const updateIntoDB = async (id, data) => {
    await prisma_1.default.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });
    const result = await prisma_1.default.admin.update({
        where: {
            id
        },
        data
    });
    return result;
};
const deleteFromDB = async (id) => {
    await prisma_1.default.admin.findUniqueOrThrow({
        where: {
            id
        }
    });
    const result = await prisma_1.default.$transaction(async (transactionClient) => {
        const adminDeletedData = await transactionClient.admin.delete({
            where: {
                id
            }
        });
        await transactionClient.user.delete({
            where: {
                email: adminDeletedData.email
            }
        });
        return adminDeletedData;
    });
    return result;
};
const softDeleteFromDB = async (id) => {
    await prisma_1.default.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });
    const result = await prisma_1.default.$transaction(async (transactionClient) => {
        const adminDeletedData = await transactionClient.admin.update({
            where: {
                id
            },
            data: {
                isDeleted: true
            }
        });
        await transactionClient.user.update({
            where: {
                email: adminDeletedData.email
            },
            data: {
                status: client_1.UserStatus.DELETED
            }
        });
        return adminDeletedData;
    });
    return result;
};
exports.AdminService = {
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB,
    softDeleteFromDB
};
