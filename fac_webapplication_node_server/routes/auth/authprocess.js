require("dotenv").config();
const db = require("../../models/mysql");

const EMAIL_ACCOUNT = process.env.EMAIL_ACCOUNT;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const nodemailer = require("nodemailer");
const otpStore = {};

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.hoasen.edu.vn",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_ACCOUNT,
    pass: EMAIL_PASSWORD,
  },
});
const storeOtp = (email, otp) => {
  const currentTime = Date.now();
  otpStore[email] = { otp, time: currentTime, used: false }; // Ghi đè OTP cũ nếu email đã tồn tại

  // Xóa OTP sau 5 phút (300000 ms)
  setTimeout(() => {
    if (otpStore[email] && otpStore[email].time === currentTime) {
      delete otpStore[email];
    }
  }, 300000);
};
const requestOTP = async (email) => {
  console.log(email);
  const otp = generateOTP();
  storeOtp(email, otp);
  let res = await db.SELECT("*", "get_user_by_gmail('" + email + "')");
  let username = res.recordset[0].name_;
  const mailOptions = {
    from: EMAIL_ACCOUNT,
    to: email,
    subject: "OTP Verification",

    html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>OTP Verification</h2>
            <p>Your OTP is: <strong>${otp}</strong></p>
            <p>Your Username is: <strong>${username}</strong></p>
            <p>This OTP will expire in 5 minutes.</p>
            <p style="color: grey; font-size: 0.9em;">If you did not request this OTP, please ignore this email.</p>
            <hr>
            <footer style="font-size: 0.8em;">
                <p>Thank you for using our service.</p>
                <p>Best regards,</p>
                <p>FLY-TEAM</p>
            </footer>
        </div>
    `,
  };
  return new Promise(async (resolve, reject) => {
    console.log();
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        resolve(error);
      } else {
        resolve({ status: true, message: "OTP has been sent to your email" });
      }
    });
  });
};

const validateOTP = async (email, otp) => {
  return new Promise(async (resolve, reject) => {
    try {
      
      const otpData = await getOtpData(email);

      if (!otpData) {
        resolve({ status: false, message: "OTP not found"});
        return;
      }

      if (otpData.used) {
        resolve({ status: false, message: "OTP has already been used"});
        return;
      }

      const currentTime = Date.now();
      const otpAge = (currentTime - otpData.time) / 1000 / 60; // Tính tuổi của OTP tính bằng phút

      if (otpAge > 5) {
        await deleteOtpData(email); // Xóa OTP đã hết hạn
        resolve({ status: false, message: "OTP has expired"});
        return;
      }

      if (otpData.otp === otp) {
        await markOtpAsUsed(email); // Đánh dấu OTP đã được sử dụng
        resolve({ status: true, message: "OTP is valid" });
      } else {
        resolve({ status: false, message: "Invalid OTP"});
      }
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};
// Giả định các hàm này là bất đồng bộ và sử dụng await khi gọi chúng
const getOtpData = async (email) => {
  // Thực hiện truy xuất otpData từ otpStore
  return otpStore[email];
};

const deleteOtpData = async (email) => {
  // Thực hiện xóa otpData khỏi otpStore
  delete otpStore[email];
};

const markOtpAsUsed = async (email) => {
  // Đánh dấu otpData là đã sử dụng
  if (otpStore[email]) {
    otpStore[email].used = true;
  }
};
const getUserByID = async (usr) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT("*", "get_user_by_id('" + usr + "')");
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
        "check_valid_user('" + name + "', '" + pass + "')"
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
      resolve({ status: true, data: res.rowsAffected[0] });
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
      resolve({ status: true, data: res.rowsAffected[0] });
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};
const editUser = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.executeProcedure("dbo.edit_user_pro", body);
      console.log(res);
      resolve({ status: true, data: res.recordset[0] });
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};

const changePassword = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.executeProcedure("dbo.edit_pwd_on_email", body);
      console.log(res);
      resolve({ status: true, message:"Đã đổi mật khẩu thành công"});
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};

module.exports = {
  getUserByID,
  createUser,
  deleteUser,
  editUser,
  checkValidUser,
  requestOTP,
  validateOTP,
  changePassword,
};
