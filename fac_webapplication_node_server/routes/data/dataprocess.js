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
    
    try {
      let res = await db.INSERT("Users", body);
      console.log(res);
      resolve({ status: true, data: res.rowsAffected[0]});
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};


module.exports = { getUser, createUser };
