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

sendEmail.sendEmailToUser = (data, password) => {           
  return new Promise ((resolve, reject) => {
    let mailOptions = {
      from: 'YOUR_VARIFIED_EMAIL', 
      to: data,
      subject: 'Email notification', 
      text:` Hi this is your password ${password} form demo application.`,
      html: `<h2>Hi this is your password ${password} form demo application.</h2>`
    }
    transporter.sendMail(mailOptions).then((response) => {
      resolve(response);
    }).catch((err) => {
      reject(err);
    })
  })
}

module.exports = sendEmail;