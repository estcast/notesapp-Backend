"use-strict";

let Encrypter = require('../Model/Encrypter');
let UserDAL = require('../Model/Data_layer/UserDAL');

let controller = {
  getNotes: async (req, res) => {
    let params = req.headers;
    let authorization = params.authorization;
    let encrypter = new Encrypter();
    let User = new UserDAL();      
    await User.connect();
    try{
      let data = encrypter.retrieve_from_jwt(authorization);               //Let's check if the JWT is legit

      let expiration = Date.parse(data.expiration);                        //Let's check expiration token
      let now = Date.now();
      if(expiration < now){
        throw new Error();
      }                                                       //
      let email = data.email;
      let notes = await User.getNotes(email);

      await User.disconnect();
      return res.status(200).send({
        notes:notes
      }); 
    }
    catch(e){
      User.disconnect();
      return res.status(401).send({                           //Not authorized.
        message:'Not authorized, please log-in again'
      });
    }
  },

  deleteNote: async(req, res) =>{
    //await new Promise(r => setTimeout(r, 1500));
    let params = req.headers;
    let authorization = params.authorization;
    let title = req.params.title;
    let encrypter = new Encrypter();
    let User = new UserDAL();      
    await User.connect();
    try{
      let data = encrypter.retrieve_from_jwt(authorization);              //Let's check if the JWT is legit

      let expiration = Date.parse(data.expiration);                       //Let's check expiration token
      let now = Date.now();
      if(expiration < now){
        throw new Error;
      }                                                       //

      let email = data.email;
      let count = await User.deleteNote(email, title);
      const notes = await User.getNotes(email);
      await User.disconnect();

      return res.status(202).send({
        message:'Note deleted',
        notes:notes
      });
      
    }catch(e){
      User.disconnect();
      return res.status(401).send({                           //Not authorized.
        message:'Not authorized, please log-in again'
      });
    }
  },

  newNote: async(req, res) =>{
    //await new Promise(r => setTimeout(r, 1500));
    let params = req.headers;
    let authorization = params.authorization;
    let title = req.params.title;
    let text = req.body.text;

    let encrypter = new Encrypter();
    let User = new UserDAL(); 
    await User.connect();
    try{
      let data = encrypter.retrieve_from_jwt(authorization);               //Let's check if the JWT is legit

      let expiration = Date.parse(data.expiration);                        //Let's check expiration token
      let now = Date.now();
      if(expiration < now){
        throw new Error();
      }                                                       //

      let email = data.email;
      let found = await User.getNote(email, title);
      if(found){
        User.disconnect();
        return res.status(400).send({                        
          message:'You cannot repeat a title from a previous note'
        });
      }

      await User.saveNote(email, title, text);
      await User.disconnect();
      return res.status(201).send({
        message:'Note created',
      });
      
    }catch(e){
      User.disconnect();
      return res.status(401).send({                           //Not authorized.
        message:'Not authorized, please log-in again'
      });
    }
  },

  editNote: async(req, res) =>{
    //await new Promise(r => setTimeout(r, 1500));
    let params = req.headers;
    let authorization = params.authorization;
    let title = req.params.title;
    let text = req.body.text;

    let encrypter = new Encrypter();
    let User = new UserDAL();      
    await User.connect();
    try{
      let data = encrypter.retrieve_from_jwt(authorization);                //Let's check if the JWT is legit

      let expiration = Date.parse(data.expiration);                         //Let's check expiration token
      let now = Date.now();
      if(expiration < now){
        throw new Error;
      }                                                                     //

      let email = data.email;
      let count = await User.editNote(email, title, text);
      await User.disconnect();

      return res.status(202).send({
        message:'Note edited'
      });
      
    }catch(e){
      User.disconnect();
      return res.status(401).send({                           //Not authorized.
        message:'Not authorized, please log-in again'
      });
    }
  }
}

module.exports = controller;