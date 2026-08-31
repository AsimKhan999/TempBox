import dotenv from 'dotenv';
dotenv.config();

export const config = {
  smtpPort: parseInt(process.env.SMTP_PORT || '25', 10),
  backendUrl: process.env.BACKEND_URL || 'http://localhost:5000',
  mailDomain: process.env.MAIL_DOMAIN || 'tempbox.com',
};
