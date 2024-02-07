const otpGenerator = require("otp-generator");
const sgMail = require("@sendgrid/mail");

const { message, subject_mail } = require("../templates/emailOtp");

const { encode } = require("../utils/crypto");
const { OTP, User } = require("../sequelize");

// To add minutes to the current time
function AddMinutesToDate(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

const sendOtpController = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      const response = { Status: "Failure", Details: "Email not provided" };
      return res.status(400).send(response);
    }

    //Generate OTP
    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });
    const now = new Date();
    const expiration_time = AddMinutesToDate(now, 5);

    //Create OTP instance in DB
    const otp_instance = await OTP.create({
      otp: otp,
      expiration_time: expiration_time,
      email,
    });

    // Create details object containing the email and otp id
    const details = {
      timestamp: now,
      check: email,
      success: true,
      action: "email_verification",
      otp_id: otp_instance.id,
    };

    // Encrypt the details object
    const encoded = encode(JSON.stringify(details));

    const email_message = message(otp);
    const email_subject = subject_mail;

    const mailOptions = {
      from: `SecuReddit <${process.env.EMAIL_ADDRESS}>`,
      to: email,
      subject: email_subject,
      html: email_message,
    };

    //Send Email
    await sgMail
      .send(mailOptions)
      .then(() => {
        return res.send({ status: "Success", verificationKey: encoded });
      })
      .catch((err) => {
        return res.status(400).send({ status: "Failure", Details: err });
      });
  } catch (err) {
    console.log(err);
    const response = { status: "Failure", Details: err.message };
    return res.status(400).send(response);
  }
};

module.exports = { sendOtpController };
