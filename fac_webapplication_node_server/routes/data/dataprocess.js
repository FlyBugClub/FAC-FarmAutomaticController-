const db = require("../../models/mysql");

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
    // const usernameExists = await checkUsernameExists(username);
    // const emailExists = await checkEmailExists(email);
    // try {
    //   if (usernameExists) {
    //     console.log("Username already exists");
    //     return resolve({ status: false, message: "Username already exists" });
    //   }
    // } catch (error) {
    //   resolve({ status: false, code: 255, message: "Error System" });
    // }
    // try {
    //   if (emailExists) {
    //     console.log("Email already exists");
    //     return resolve({ status: false, message: "Email already exists" });
    //   }
    // } catch (error) {
    //   resolve({ status: false, code: 255, message: "Error System" });
    // }

    try {
      let res = await db.INSERT("Users", body);
      console.log(res);
      resolve({ status: true, data: res.rowsAffected[0]});
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};

// const checkUsernameExists = async (username) => {
//   const [rows] = await pool.query("SELECT * FROM Users WHERE username = ?", [
//     username,
//   ]);
//   return rows.length > 0;
// };

// const checkEmailExists = async (email) => {
//   const [rows] = await pool.query("SELECT * FROM Users WHERE email = ?", [
//     email,
//   ]);
//   return rows.length > 0;
// };
module.exports = { getUser, createUser };

// select * from Customer_Occupation("18")
