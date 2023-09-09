"use-strict";

let User = require('../Model/Data_layer/UserDAL');
let Encrypter = require('../Model/Encrypter');

let controller = {
  login: async (req, res) => {
    //await new Promise(r => setTimeout(r, 1500));
    let params = req.body;
    let email = params.email;
    let password = params.password;

    if(email.search("@") < 1){                        // HTTP 400 error. Server can not process request because a client error.
      return res.status(400).send({                         
        status:'Fail',
        message:'Wrong email format'
      });
    }

    let user = new User();                               //UserDAL
    await user.connect();

    let emailFound = await user.getUser(params.email);           // Let's check if the email exits.
    if(emailFound.length !== 0){
      if(password == emailFound[0].password){
        await user.disconnect();

        let now = Date.now();
        let date_obj = new Date(now);
        date_obj.setDate(date_obj.getDate() + 1);            //Users have 24 hours to be logged in

        let data = {
          user:emailFound[0].user_name,
          email:emailFound[0].email,
          expiration:date_obj
        }
        let encrypter = new Encrypter();
        let jwt = encrypter.generate_jwt(data);
        return res.status(200).send({
          user:emailFound[0].user_name,
          email:emailFound[0].email,
          jwt:jwt,
          message:`Welcome ${emailFound[0].user_name}`  
        });
      } 
    }
    
    await user.disconnect();
    return res.status(404).send({
      message:'Wrong Email or password'
    });
    
  },

  recover: async (req, res) => {
    
  }
};

module.exports = controller;
