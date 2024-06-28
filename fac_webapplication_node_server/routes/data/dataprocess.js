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
          let laststatus_esp = await db.SELECT("*", "dbo.get_controlstate('" + id_esp + "')");
          let laststatus_equipment = laststatus_esp.recordsets[0].filter(item => item.id_equipment === json[0]["id"])
          json.forEach(obj => {
            obj.laststatus = laststatus_equipment[0];
        });
        
          resolve({ status: true, data: json});
        }
      else 
      {
        let res = await db.executeScarlarFunction(" dbo.getEquipmentSensorInfoWithIdequipment('" + id_esp + "','"+id_equipment+"') AS result");
          let result= res.recordset[0].result
          let json = JSON.parse(result)
          let laststatus_esp = await db.SELECT("*", "dbo.get_controlstate('" + id_esp + "')");
          let laststatus_equipment = laststatus_esp.recordsets[0].filter(item => item.id_equipment === json[0]["id"])
          json.forEach(obj => {
            obj.laststatus = laststatus_equipment[0];
        });
          resolve({ status: true, data: json});
      }
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};

const getEquipmentListById = async (id_esp) => {
  return new Promise(async (resolve, reject) => {
    try {
          let res = await db.executeScarlarFunction(" dbo.get_equipment_by_idesp('" + id_esp + "') AS result");
          let result= res.recordset[0].result
          let json = JSON.parse(result)
          resolve({ status: true, data: json});
       
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};

const getLastStatus = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT("*", "dbo.get_controlstate('" + id + "')");
      resolve({ status: true, data: res.recordsets[0] });
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
}

const getSchedule = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.SELECT("*", "dbo.get_equipment_schedule('" + id + "')");
      resolve({ status: true, data: res.recordsets[0] });
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
}

const editLastStatus = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.executeProcedure("dbo.edit_last_state_pro", body);
      resolve({ status: true});
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};

const insertFarm = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.executeProcedure("dbo.add_farm_pro", body);
      resolve({ status: true});
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};

const editFarm = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.executeProcedure("dbo.edit_userfarm_pro", body);
      resolve({ status: true});
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};


const insertEquipment = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.executeJsonProcedure("dbo.insert_device_pro", body);
      resolve({ status: true});
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};

const editEquipment = async (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.executeProcedure("dbo.edit_device_pro", body);
      resolve({ status: true});
    } catch (error) {
      resolve({ status: false, code: 255, message: "Error System" });
    }
  });
};

module.exports = {
   getDashboard,
   getEspInfo ,
   getEquipmentListById,
   editLastStatus,
   getLastStatus,
   insertEquipment,
   editEquipment,
   insertFarm,
   editFarm,
   getSchedule};

// select * from Customer_Occupation("18")
