const nodemailer = require('nodemailer');
var sendEmail = {};

// simple way using your gmail credentials
// var transporter = nodemailer.createTransport({
//   service : 'Gmail',
//   auth: {
//     user : 'YOUR_GMAIL_ID',
//     pass : 'YOUR_GMAIL_PASSWORD'
//   }
// })

// using AWS SES service
const SMTPuser = process.env.SMTPusername;
const SMTPpass = process.env.SMTPpassword;
const host = process.env.SMTPhost;
const port = process.env.SMTPport;
const transporter = nodemailer.createTransport(`smtp://${SMTPuser}:${SMTPpass}@${host}:${port}`);

const { EmailTemplate } = require('email-templates-v2');
const path = require('path');

sendEmail.sendEmailToUser = (data, password) => {           
  return new Promise ((resolve, reject) => {
    const templateDirectory = path.join(__dirname,'../templates','forgotPasswordEmail');
    const template = new EmailTemplate(templateDirectory);
    template.render({ password : password }).then((result) => {
        const { html, subject, text } = result;
        let mailOptions = {
          from: 'YOUR_VARIFIED_EMAIL', 
          to: data,
          subject, 
          text,
          html
        }
        transporter.sendMail(mailOptions).then(() => {
          resolve({"newPassword" : password});
        }).catch((err) => {
          reject(err);
        })
    }).catch(err => { 
      console.log(err)})
  })
}

module.exports = sendEmail;