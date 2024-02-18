const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");

exports.sendOTP = async (req, res) => {
  try {
    //fetch email
    const { email } = req.body;

    //check if user already exist or not
    const checkUserPresent = await User.findOne({ email });

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User Already Exist",
      });
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log(`OTP Generated : ${otp}`);

    const result = await OTP.findOne({ otp });

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp });
    }
    const otpBody = await OTP.create({ otp, email });
    console.log(otpBody);

    res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
    });
  } catch (e) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//sendOTP
//chnagePassword
//Login
//SignUp
