const db = require('../../models/mysql');

const TestAPI = async (usr) => {
  return new Promise(async(resolve, reject) => {
        //await ...TestAPI
        try {
           
             let res = await db.SELECT('*','Users',"where id_user = '"+usr+"'");
            resolve({status:true, data:res.recordsets[0]});
        } catch (error) {
            // reject(error);
            resolve({status:false, code:255, message:"Error System"});
        }
       
  });
};

module.exports = { TestAPI };



// select * from Customer_Occupation("18")