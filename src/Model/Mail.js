"use-strict";

require('dotenv').config();
const nodemailer = require('nodemailer');
const USER = process.env.USER;
const PASSWORD = process.env.MAIL_PASSWORD;
const SERVICE = process.env.SERVICE;

class Mail{
  constructor(){
    this.transporter = nodemailer.createTransport({
      service:SERVICE,
      auth:{
        user:USER,
        pass:PASSWORD
      }
    });
  }

  async sendMail(receptor, subject, text){
    const mailOptions = {
      from:USER,
      to:receptor,
      subject:subject,
      text:text
    }
    this.transporter.sendMail(mailOptions, (err, info) =>{
      if(err){
        console.log('Email error' + err);
        throw new Error('Email not sent');
      }
      else{
        console.log('Email sent' + info.response);
      }
    });
  }

}

module.exports = Mail;