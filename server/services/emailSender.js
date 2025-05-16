const nodemailer = require("nodemailer");
const { emailRegex } = require("../helpers/strings");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const EmailNotification = require("../models/emailNotification");
const emailTemplates = require("../helpers/emailTemplates");

const sendEmail = async (to = "", subject, text = "", html) => {
  // Configure Nodemailer transporter

  if (!emailRegex.test(to?.trim())) {
    throw new Error(`(${to}) is not a valid email address!`);
  }

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.info(`Email sent of subject: ${subject}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};

const sendVerificationOTP = async (email, otpCode) => {
  const subject = "Email Verification OTP";
  const text = `Your OTP for email verification is: ${otpCode}`;
  const html = `<p>Your OTP for email verification is: <strong>${otpCode}</strong></p>`;
  await sendEmail(email, subject, text, html);
};

const sendResetPasswordOTP = async (email, otpCode) => {
  const subject = "Password Reset OTP";
  const text = `Your OTP for password reset is: ${otpCode}`;
  const html = `<p>Your OTP for password reset is: <strong>${otpCode}</strong></p>`;
  await sendEmail(email, subject, text, html);
};
const sendManagerCreationEmail = async ({
  email,
  password,
  firstName = "",
  lastName = "",
}) => {
  const subject = "Welcome! Your Manager Account Has Been Created";
  const text = `Dear ${firstName} ${lastName},\n\nYour account has been successfully created.\n\nLogin Details:\nEmail: ${email}\nPassword: ${password}\n\nPlease log in and change your password for security.\n\nBest regards,\nYour Team`;
  const html = `<p>Dear ${firstName} ${lastName},</p>
                <p>Your account has been successfully created.</p>
                <p><strong>Login Details:</strong></p>
                <p>Email: ${email}<br>Password: ${password}</p>
                <p>Please log in and change your password for security.</p>`;
  await sendEmail(email, subject, text, html);
};

const sendEmailNotification = async (user, type, data) => {
  if (!user.email) {
    console.log(`⚠️ User email not found.`);
    return;
  }

  const subject = `Notification: ${
    type.charAt(0).toUpperCase() + type.slice(1)
  }`;
  const html = emailTemplates[type](data);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    await EmailNotification.create({
      recipient: user._id,
      email: user.email,
      type,
      status: "sent",
    });
    console.log(`✅ Email sent to ${user.email} for ${type}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${user.email}: ${error.message}`);
    await EmailNotification.create({
      recipient: user._id,
      email: user.email,
      type,
      status: "failed",
    });
  }
};

module.exports = {
  sendVerificationOTP,
  sendResetPasswordOTP,
  sendEmailNotification,
  sendManagerCreationEmail,
};
