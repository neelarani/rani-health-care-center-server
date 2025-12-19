"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../../../config"));
const emailSender = async (email, html) => {
    const transporter = nodemailer_1.default.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: config_1.default.emailSender.email,
            pass: config_1.default.emailSender.app_pass,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    const info = await transporter.sendMail({
        from: '"Rani Health Care" <neela9624@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'Reset Password Link', // Subject line
        //text: "Hello world?", // plain text body
        html, // html body
    });
};
exports.default = emailSender;
