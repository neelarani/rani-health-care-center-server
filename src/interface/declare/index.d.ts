// import { UserRole } from "@prisma/client";

export type IJWTPayload = {
  email: string;
  role: 'User' | 'ADMIN' | 'PATIENT' | 'DOCTOR';
};

declare global {
  namespace Express {
    interface Request {
      user: IJWTPayload;
    }
  }
}

export {};
