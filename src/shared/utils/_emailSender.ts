import config from '@/config';
import nodemailer from 'nodemailer';

export const emailSender = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.app_pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: '"Rani Health Care" <neela9624@gmail.com>',
    to: email,
    subject: 'Reset Password Link',
    html,
  });

  return info;
};
