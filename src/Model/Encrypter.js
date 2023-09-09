"use-strict";

require('dotenv').config();
const cryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const ENCRYPTION_SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY;

class Encrypter{
  constructor(){
  }
  encrypt(data){
    const token = jwt.sign(data, JWT_SECRET_KEY);                                     //Creates json web token
    const encrypted = cryptoJS.AES.encrypt(token, ENCRYPTION_SECRET_KEY).toString();  //Encrypts data using AES
    return encrypted;
  }

  decrypt(encrypted){
    let decrypted = cryptoJS.AES.decrypt(encrypted, ENCRYPTION_SECRET_KEY);         //Decrypts  
    let originalText = decrypted.toString(cryptoJS.enc.Utf8);                       //Recovers original string (jwt)
    let data = jwt.verify(originalText, JWT_SECRET_KEY);                             
    return data;
  }

  hash(content){
    return cryptoJS.SHA256(content).toString();
  }

  generate_jwt(content){
    return jwt.sign(content, JWT_SECRET_KEY); 
  }

  retrieve_from_jwt(token){
    return jwt.verify(token, JWT_SECRET_KEY)
  }
}

module.exports = Encrypter;