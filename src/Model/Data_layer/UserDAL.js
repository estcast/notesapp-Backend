"use-strict";

require('dotenv').config();
const { MongoClient } = require("mongodb");

const DB_URL = process.env.DB_URL; 
const DB_NAME = process.env.DB_NAME;
const COLLECTION_NAME = process.env.COLLECTION;

class UserDAL {                            //Data access layer
  constructor() {
    this.client = new MongoClient(DB_URL, {useUnifiedTopology: true});
    this.db = null;
  };

  async connect(){
    try{
      await this.client.connect();
      this.db = this.client.db(DB_NAME);
    }
    catch(e){console.log(e);}
  };

  async disconnect(){
    try{
      await this.client.close();
    }
    catch(e){console.log(e);}
  };

  async getNotes(email){
    const collection = this.db.collection(COLLECTION_NAME);
    let result = null;
    try{
      result = await collection.findOne({email:email},{projection:{_id:0, user_name:0, password:0, email:0}});
      return result;
    }
    catch(e){console.log(e);}
    return result;
  };

  async getUser(user_email){
    const collection = this.db.collection(COLLECTION_NAME);
    let result = null;
    try{
      result = await collection.find({email:user_email},{projection:{notes:0}}).toArray();
      if(result.length == 0)
        return [];
      else
        return result;
    }
    catch(e){console.log(e);}
    return result;
  };

  async saveUser(user){
    const collection = this.db.collection(COLLECTION_NAME);
    let result = null;
    try{
      result = await collection.insertOne(user);
      return result.insertedId;
    }
    catch(e){console.log(e);}
    return false;
  };

  async deleteNote(user_email, title){
    const collection = this.db.collection(COLLECTION_NAME);
    try{
      let result = await collection.updateOne(
        {email:user_email},
        {$pull:{notes:{title:title}}}
      );
      return result.modifiedCount;
    }
    catch(e){
      return false;
    }
  };

  async saveNote(user_email, title, text){
    const collection = this.db.collection(COLLECTION_NAME);
    try{
      let result = await collection.updateOne(
        {email:user_email},
        {$push:{notes:{title:title,text:text}}}
      );
      return result.modifiedCount;
    }
    catch(e){
      return false;
    }
  };

  async getNote(user_email, title){
    const collection = this.db.collection(COLLECTION_NAME);
    let result = false;
    try{
      result = await collection.findOne(
        {
          $and:
          [
            {email:user_email},
            {notes:{$elemMatch:{title:title}}}
          ]
        },{projection:{notes:0}}
      );
      return result;
    }
    catch(e){console.log(e);}
    return false;
  };

  async editNote(user_email, title, text){
    const collection = this.db.collection(COLLECTION_NAME);
    let result = false;
    try{
      result = await collection.updateOne(
        {email:user_email,'notes.title':title},   
        {
          $set:{'notes.$.text':text}
        }
      );
      return result.modifiedCount;
    }
    catch(e){console.log(e);}
    return false;
  };
}
                             
module.exports = UserDAL;
