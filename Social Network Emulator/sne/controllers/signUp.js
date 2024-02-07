const sgMail = require("@sendgrid/mail");
const { User, OTP } = require("../sequelize");
const { message, subject_mail } = require("../templates/joining");
const { decode } = require("../utils/crypto");

const signUpController = async (req, res, next) => {
  const { verification_key, email, password, pdsId } = req.body;
  try {
    if (!verification_key || !email || !password || !pdsId) {
      const response = {
        status: "Failure",
        message: "Bad request",
      };
      return res.status(400).send(response);
    }

    const decodedVerificationKey = JSON.parse(decode(verification_key));

    if (!decodedVerificationKey.otp_id) {
      const response = {
        status: "Failure",
        message: "OTP not found",
      };
      return res.status(400).send(response);
    }

    const otp_instance = await OTP.findOne({
      where: { id: decodedVerificationKey.otp_id },
    });

    if (!otp_instance?.verified) {
      const response = {
        status: "Failure",
        message: "Email is not verified.",
      };
      return res.status(400).send(response);
    }

    const [_, created] = await User.findOrCreate({
      where: { email },
      defaults: { email, password, pdsId },
    });

    if (!created) {
      const response = {
        status: "Failure",
        message: "User already exists.",
      };
      return res.status(409).send(response);
    }

    res.json({
      status: "Success",
      message: "User created successfully!",
    });

    const body = message(email.split("@")[0]);

    const mailOptions = {
      from: `SecuReddit <${process.env.EMAIL_ADDRESS}>`,
      to: email,
      subject: subject_mail,
      text: body,
    };

    await sgMail.send(mailOptions);
  } catch (err) {
    console.log(err);
    const response = {
      status: "Failure",
      message: "Something went wrong!",
    };
    return res.status(500).send(response);
  }
};

module.exports = { signUpController };
