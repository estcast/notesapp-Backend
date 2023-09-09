'use-strict';

require('dotenv').config();  
let User = require('../Model/Data_layer/UserDAL');
let Mailer = require('../Model/Mail');
let Encrypter = require('../Model/Encrypter');

const PAGE = process.env.PAGE;
const PROTOCOL = process.env.PROTOCOL;

let controller = {

  notify: async(req, res) =>{
    await new Promise(r => setTimeout(r, 1500));
    let params = req.body;
    let user = new User();                               //UserDAL
    await user.connect();

    let emailFound = await user.getUser(params.email);    // Let's check if user already exits.
    if(emailFound.length > 0){
      user.disconnect();
      return res.status(400).send({                     // HTTP 400 error. Server can not process request because a client error.
        status:'Fail',
        message:'Email already stored'
      })
    }   
    
    let email = params.email;
    if(email.search("@") < 1){                      //Let's check email format
      user.disconnect();
      return res.status(400).send({                        
        status:'Fail',
        message:'Wrong email format'
      });
    }                                             
    
    user.disconnect();
    let encrypter = new Encrypter();                     //Encrypter
    let mailer = new Mailer();                           //Mailer

    let now = Date.now();
    let date_obj = new Date(now);
    date_obj.setDate(date_obj.getDate() + 1);            //Users have 24 hours to complete sign up
    
    const data = {
      username:params.name,
      password:params.password,
      email:params.email,
      expiration:date_obj
    }
    const encrypted_data = encrypter.encrypt(data);
    try{                                                  
      await mailer.sendMail(
        params.email,
        "Notes's app Sign up Request",
        `Thank you for joining our community. Go to the following link to complete your sign up:
        ${PROTOCOL}://${PAGE}/user/verify?q=${encrypted_data} `
      );
    }catch(e){
      return res.status(404).send({
        status:'Fail',
        message:'Email does not exist'
      })
    }                                                   //End of try block
    return res.status(200).send({
      status:'Success',
      message:'Check your E-Mail'
    })
  },

  verify: async(req, res) =>{
    await new Promise(r => setTimeout(r, 1500));
    let query = req.query.q;
    let encrypted = query.split(" ").join("+");           //* Note 1.  See notes at the end of this file.
    try{
      let encrypter = new Encrypter();                     //Encrypter
      let data = encrypter.decrypt(encrypted);

      let date = Date.parse(data.expiration);             //Let's check the expiration date                   
      let now = Date.now();
      if(date < now){
        throw new Error();
      }                                                   //

      const user = new User();                         //UserDAL
      await user.connect();

      let emailFound = await user.getUser(data.email);       // Let's check if user already open this link.
      if(emailFound.length > 0){
        user.disconnect();
        return res.status(400).send(
        `
        <h1>User already registered</h1>
        <h2>
          Please, log in with your credentials
        </h2>
        `
        );
      }   
      
      const user_data = {
        user_name:data.username,
        password:encrypter.hash(data.password),
        email:data.email,
        notes:[]
      }

      await user.saveUser(user_data);
      user.disconnect();
      return res.status(200).send(
        `
        <h1>User verified</h1>
        <h2>Now you can log in</h2>
        `
      );
    }
    catch(e){
      console.log(e);
      return res.status(404).send(
        `
        <h1>An error has occured</h1>
        <h2>
          Please, try again. If the error persist, try the sign up process again 
        </h2>
        `
      );
    }
  }
}

module.exports = controller;
 
    /*
    Note 1:
      The encrypted string contains this symbol +.
      When the GET method is executed from a Browser. It changes every + symbol for a white space " ".
      This causes that the method decrypt does not recognizes the encrypted string.
      This solution replaces every " " for a symbol of +. Leaving the original encrypted string.
    */
