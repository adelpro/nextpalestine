import { mailOptions, transporter } from '@/utils/nodemailer.config';
import { NextRequest, NextResponse } from 'next/server';
import { isValidEmail } from '@/utils/isValidEmail';
export async function POST(request: NextRequest) {
  const { name, email, message } = await request.json();

  // Validating the data
  if (!name || !email || !isValidEmail(email) || !message) {
    return NextResponse.json(
      { message: 'Unprocessable Entity' },
      { status: 422, statusText: 'Unprocessable Entity' },
    );
  }

  try {
    await transporter.sendMail({
      ...mailOptions,
      subject: `${process.env.NEXT_PUBLIC_APP_NAME} - feedback`,
      text: `Contact form submitted from ${process.env.NEXT_PUBLIC_APP_NAME}\n
               Name: ${name}\n
               Email: ${email}\n
              Message: ${message}`,
      html: `<div style="font-family: 'Arial', sans-serif; color: #333; padding: 20px;">
              <h1 style="color: #0066cc;">Contact form submitted from ${process.env.NEXT_PUBLIC_APP_NAME}</h1>
              <p style="margin-bottom: 10px;"><strong>Name:</strong> ${name}</p>
              <p style="margin-bottom: 10px;"><strong>Email:</strong> ${email}</p>
              <p style="margin-bottom: 10px;"><strong>Message:</strong> ${message}</p>
             </div>`,
    });
    return NextResponse.json({ message: 'message sent successfully' });
  } catch {
    return NextResponse.json(
      {
        message: 'Failed to send message, Please try again later.',
      },
      { status: 500, statusText: 'Internal Server Error' },
    );
  }
}
