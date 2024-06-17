const db = require("../../models/mysql");
const EMAIL_ACCOUNT = "flybug@hoasen.edu.vn";
const EMAIL_PASSWORD = "ieeapapxxiwpksex";
const nodemailer = require('nodemailer');
const { options } = require('./auth');
const otpStore = {}; 


const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.hoasen.edu.vn',
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_ACCOUNT,
    pass: EMAIL_PASSWORD,
  },
});
const requestOTP = async (email) => {
console.log(EMAIL_ACCOUNT);
console.log(EMAIL_PASSWORD);
console.log(email);
  const otp = generateOTP();
  otpStore[email] = otp;
  const mailOptions = {
    from: EMAIL_ACCOUNT,
    to: email,
    subject: 'OTP Verification',
    text: `Your OTP is ${otp}`,
  };
  return new Promise(async (resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        resolve(error);
      } else {
        resolve({ status: true, data: otp });
      }
    });
  });
};
const getUserByID = async (usr) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT(
        "*",
        "get_user_by_id('" + usr + "')",
        
      );
      resolve({ status: true, data: res.recordsets[0] });
    } catch (error) {
      // reject(error);
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};

const checkValidUser = async (name, pass) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT(
        "*",
        "check_valid_user('" + name + "', '" + pass + "')",
        
      );
      if (res.recordsets[0].length > 0) {
        delete res.recordsets[0][0].password;
      }
      console.log(res);
      resolve({ status: true, data: res.recordsets[0] });
    } catch (error) {
      // reject(error);
      resolve({ status: false, code: 255, message: "Error System" });
    }
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
const editUser = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.executeProcedure("dbo.edit_user_pro",body);
      console.log(res);
      resolve({ status: true, data: res.recordset[0]});
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};


module.exports = {getUserByID, createUser, deleteUser, editUser, checkValidUser, requestOTP};