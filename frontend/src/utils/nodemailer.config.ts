import SMTPTransport from 'nodemailer/lib/smtp-transport';
import nodmailer from 'nodemailer';
const email = process.env.NEXT_PUBLIC_FEED_BACK_EMAIL;
const pass = process.env.NEXT_PUBLIC_FEED_BACK_PASSWORD;
const service = process.env.NEXT_PUBLIC_FEED_BACK_SERVICE;
const host = process.env.NEXT_PUBLIC_FEED_BACK_HOST;
const port = process.env.NEXT_PUBLIC_FEED_BACK_PORT;

export const transporter = nodmailer.createTransport({
  service,
  host,
  port,
  auth: {
    user: email,
    pass,
  },
} as SMTPTransport.Options);

export const mailOptions = {
  from: email,
  to: email,
};
