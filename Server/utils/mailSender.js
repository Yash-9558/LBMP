const nodemailer = require("nodemailer");

const mailSender = async (email, title, otp) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    let info = await transporter.sendMail({
      from: "StudyNotion",
      to: `${email}`,
      subject: `${title}`,
      html: `${otp}`,
    });
    console.log(info);
    return info;
  } catch (e) {
    console.log(e.message);
  }
};

module.exports = { mailSender };
