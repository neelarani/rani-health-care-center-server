// import { UserRole } from "@prisma/client";

export type IJWTPayload = {
  email: string;
  role: "Admin" | "User";
};

declare global {
  namespace Express {
    interface Request {
      user: IJWTPayload;
    }
  }
}

export {};
