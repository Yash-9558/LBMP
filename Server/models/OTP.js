const mongoose = require("mongoose");
const { mailSender } = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60,
  },
});

const SendVerificationMail = async (email, otp) => {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email From StudyNotion",
      otp
    );
  } catch (e) {
    console.log("error occured while sending emails", e);
  }
};

OTPSchema.pre("save", async (next) => {
  await SendVerificationMail(this.email, this.otp);
  next();
});

module.exports = mongoose.model("OTP", OTPSchema);
