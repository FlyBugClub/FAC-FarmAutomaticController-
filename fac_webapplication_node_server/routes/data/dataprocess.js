const db = require("../../models/mysql");

const getDashboard = async (id_user) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT("*", "get_dashboard('" + id_user + "')");
      console.log(res);
      resolve({ status: true, data: res.recordsets[0] });
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};

module.exports = { getDashboard };

// select * from Customer_Occupation("18")
