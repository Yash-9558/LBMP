const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");

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

exports.signUp = async (req, res) => {
  //data fetch from request body
  //validate
  //password and confirmPassword match
  //check if user exist
  //find most recent stored OTP
  //validate OTP
  //Hash Password
  //entry create in DB
  //return res
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      //unautorized user
      return res.status(400).json({
        success: false,
        message: "All Fields Are Required",
      });
    }

    if (confirmPassword !== password) {
      //client side error,server don't understand
      return res.status(400).json({
        success: false,
        message:
          "password and confirmPassword Value does not match , please try again",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(403).json({
        success: false,
        message: "User Already Registered",
      });
    }

    const recentOTP = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOTP);

    if (recentOTP.length === 0) {
      return res.status(403).json({
        success: false,
        message: "OTP Not Found",
      });
    }

    if (recentOTP[0].otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Wrong OTP Enter",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber,
    });
    const user = await User.create({
      firstname,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      contactNumber,
      additionalDetails: profileDetails._id,
      image: `https://ui-avatars.com/api/?name=${firstName}+${lastName}`,
    });

    return res.status(200).json({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "User Can't Register, Please Try Again",
    });
  }
};

exports.Login = async (req, res) => {};

//sendOTP
//chnagePassword
//Login
//SignUp
