import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3000;

export const NODE_ENV = process.env.NODE_ENV || 'development';

export const DEV_DB_URL = process.env.DEV_DB_URL;

export const PROD_DB_URL = process.env.PROD_DB_URL;

export const JWT_SECRET = process.env.JWT_SECRET;

export const JWT_EXPIRY = process.env.JWT_EXPIRY || '1d';

export const MAIL_ID = process.env.MAIL_ID;

export const MAIL_PASSWORD = process.env.MAIL_PASSWORD;

export const REDIS_HOST =  process.env.REDIS_HOST;

export const REDIS_PORT =  process.env.REDIS_PORT;

export const APP_LINK = process.env.APP_LINK || 'http://localhost:5000';

export const ENABLE_EMAIL_VARIFICATION = process.env.ENABLE_EMAIL_VARIFICATION || false;

export const AWS_REGION =  process.env.AWS_REGION;

export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;

export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export const RAZORPAY_SECRET_KEY = process.env.RAZORPAY_SECRET_KEY;

export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;

export const CURRENCY = process.env.CURRENCY;

export const RECEIPT_SECRET = process.env.RECEIPT_SECRET || 'reciept_1103';