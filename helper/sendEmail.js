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

sendEmail.sendEmailToUser = (data) => {           
  return new Promise ((resolve, reject) => {
    let mailOptions = {
      from: 'VARIFIED_SMTP_EMAIL_ID', 
      to: data,
      subject: 'SMTP_PASSWORD', 
      text: 'Hi this is text.',
      html: '<h2>hi this is from html.</h2>'
    }
    transporter.sendMail(mailOptions).then((response) => {
      resolve(response);
    }).catch((err) => {
      reject(err);
    })
  })
}

module.exports = sendEmail;