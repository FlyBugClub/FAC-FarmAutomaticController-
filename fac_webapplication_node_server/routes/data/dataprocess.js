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
const getEspInfo = async (id_esp,id_equipment) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (id_equipment == "1")
        {
          let res = await db.executeScarlarFunction(" dbo.getEquipmentSensorInfo('" + id_esp + "') AS result");
          let result= res.recordset[0].result
          let json = JSON.parse(result)
          resolve({ status: true, data: json});
        }
      else 
      {
        let res = await db.executeScarlarFunction(" dbo.getEquipmentSensorInfoWithIdequipment('" + id_esp + "','"+id_equipment+"') AS result");
          let result= res.recordset[0].result
          let json = JSON.parse(result)
          resolve({ status: true, data: json});
      }
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};

module.exports = { getDashboard,getEspInfo };

// select * from Customer_Occupation("18")
