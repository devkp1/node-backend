import nodemailer from 'nodemailer';

export const generateOTP = () => {
  const otpLength = 6;
  const otp = Array.from({ length: otpLength }, () =>
    Math.floor(Math.random() * 10),
  ).join('');
  return otp;
};

export const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
      user: process.env.USER_NAME,
      pass: process.env.USER_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.USER_NAME,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};
