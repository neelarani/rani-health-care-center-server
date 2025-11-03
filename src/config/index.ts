import { cleanEnv, str, num } from "envalid";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const env = cleanEnv(process.env, {
  NODE_ENV: str({ default: "development" }),
  PORT: num({ default: 5000 }),
  DATABASE_URL: str(),

  WHITE_LIST_ORIGIN: str(),

  CLOUDINARY_API_SECRET: str(),
  CLOUDINARY_CLOUD_NAME: str(),
  CLOUDINARY_API_KEY: str(),

  OPENROUTER_API_KEY: str(),

  STRIPE_SECRET_KEY: str(),
  STRIPE_WH_SECRET_KEY: str(),

  EMAIL: str(),
  APP_PASS: str(),

  JWT_SECRET: str(),
  EXPIRES_IN: str(),
  REFRESH_TOKEN_SECRET: str(),
  REFRESH_TOKEN_EXPIRES_IN: str(),
  RESET_PASS_TOKEN: str(),
  RESET_PASS_TOKEN_EXPIRES_IN: str(),

  SALT_ROUND: num({ default: 10 }),
  RESET_PASS_LINK: str(),
});

export default {
  node_env: env.NODE_ENV,
  port: env.PORT,
  database_url: env.DATABASE_URL,
  white_list_origin: env.WHITE_LIST_ORIGIN,
  cloudinary: {
    api_secret: env.CLOUDINARY_API_SECRET,
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
  },
  openRouterApiKey: env.OPENROUTER_API_KEY,
  stripe: {
    secret_key: env.STRIPE_SECRET_KEY,
    web_hook_secret: env.STRIPE_WH_SECRET_KEY,
  },
  emailSender: {
    email: env.EMAIL,
    app_pass: env.APP_PASS,
  },
  jwt: {
    jwt_secret: env.JWT_SECRET,
    expires_in: env.EXPIRES_IN,
    refresh_token_secret: env.REFRESH_TOKEN_SECRET,
    refresh_token_expires_in: env.REFRESH_TOKEN_EXPIRES_IN,
    reset_pass_secret: env.RESET_PASS_TOKEN,
    reset_pass_token_expires_in: env.RESET_PASS_TOKEN_EXPIRES_IN,
  },
  salt_round: env.SALT_ROUND,
  reset_pass_link: env.RESET_PASS_LINK,
};
