const path = require('path')
const fs = require('fs')
const { con } = require('./db')
const EventEmitter = require('events');
const resetEmitter = new EventEmitter();
const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = (req, res) => {
  console.log(req.body)
  const msg = {
    to: req.body.email,
    from: 'kiki@mscode.dev',
    subject: 'Password Reset',
    text: 'Here is your password reset link: [link]',
    html: '<p>Here is your password reset link: [link]</p>',
  };
  sgMail.send(msg);
  res.status(200).send('ok')
}




module.exports = { sendMail }

