
const EMAIL_ACCOUNT = process.env.EMAIL_ACCOUNT;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const nodemailer = require('nodemailer');

const db = require("../../models/mysql");

const otpStore = {}; // Lưu trữ tạm thời các OTP

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  
  auth: {
    user: EMAIL_ACCOUNT,
    pass: EMAIL_PASSWORD,
  },
});
const requestOTP = async (email) => {
console.log("hehe");
  const otp = generateOTP();
  otpStore[email] = otp;
  const mailOptions = {
    from: EMAIL_ACCOUNT,
    to: email,
    subject: 'OTP Verification',
    text: `Your OTP is ${otp}`,
  };
  console.log("hehe");
  return new Promise(async (resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(error);
      } else {
        resolve('Email sent: ' + info.response);
      }
    });
  });
};

const getUser = async (usr, pass, name) => {
  return new Promise(async (resolve, reject) => {
    if (pass === undefined) {
      try {
        let res = await db.SELECT(
          "id_user, name, phone_no, gmail",
          "Users",
          "where id_user = '" + usr + "'"
        );
        resolve({ status: true, data: res.recordsets[0] });
      } catch (error) {
        // reject(error);
        resolve({ status: false, code: 255, message: "Error System" });
      }
    } else {
      try {
        let res = await db.SELECT(
          "id_user, name, phone_no, gmail",
          "Users",
          "where name = '" + usr + "' and password = '" + pass + "'"
        );
        if (res.recordsets[0].length > 0) {
          delete res.recordsets[0][0].password;
        }
        resolve({ status: true, data: res.recordsets[0] });
      } catch (error) {
        // reject(error);
        resolve({ status: false, code: 255, message: "Error System" });
      }
    }
    //await ...TestAPI
  });
};

const createUser = async (body) => {
  return new Promise(async (resolve, reject) => {
    const { username, email } = body;
    
    try {
      let res = await db.INSERT("Users", body);
      console.log(res);
      resolve({ status: true, data: res.rowsAffected[0]});
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};

const deleteUser = async (name) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.DELETE("Users", "where name = '" + name + "'");
      console.log(res);
      resolve({ status: true, data: res.rowsAffected[0]});
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};
module.exports = { requestOTP, getUser, createUser, deleteUser };