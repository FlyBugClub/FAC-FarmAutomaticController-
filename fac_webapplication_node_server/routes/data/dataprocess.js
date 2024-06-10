const db = require('../../models/mysql');

const TestAPI = async () => {
  return new Promise(async(resolve, reject) => {
        //await ...TestAPI
        try {
           
             let res = db.SELECT('*','Users','')
            console.log(res);
            resolve({status:true, message:"Server connected 2"});
        } catch (error) {
            reject(error);
            // resolve({status:false, code:255, message:"Error System"});
        }
       
  });
};

module.exports = { TestAPI };



// select * from Customer_Occupation("18")