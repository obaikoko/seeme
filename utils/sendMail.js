import nodemailer from 'nodemailer';
import asyncHandler from 'express-async-handler';

const sendMail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAILEMAIL,
        pass: process.env.GMAILPASSWORD,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    const mailOptions = {
      from: 'SeeMe',
      to: email,
      subject: subject,
      text: text,
    };

    await transporter.sendMail(mailOptions);
    return true; // Indicate successful email sending
  } catch (error) {
    console.error(error);
    throw new Error('Email could not be sent.');
  }
}

export default sendMail;
