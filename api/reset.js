const path = require('path')
const fs = require('fs')
const { con } = require('./db')
const EventEmitter = require('events');
const resetEmitter = new EventEmitter();
const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = (req, res) => {
  console.log(req.body)
  con.query(resetQuery(req.body.email), (err, results, fields) => {
    if (err) {

      console.log(err)

    } else if (results) {
      console.log(results[1][0].reset_key);
      const link = `http://localhost:3001/reset/${results[1][0].reset_key}`;
      const msg = {
        to: req.body.email,
        from: 'kiki@mscode.dev',
        subject: 'Password Reset',
        text: `Here is your password reset link: ${link}`,
        html: `<p>Here is your password reset link: ${link}</p>`,
      };
      sgMail.send(msg);
      res.status(200).send('Ok')
    }
    
  })
}

const randNum = () => {
  return Math.floor(Math.random() * Math.pow(10, 16))
}

const resetQuery = username => {
  return `insert into user_resets (user_id, created_at, reset_key) values ((select id from users where username='${username}'), now(), '${randNum()}'); select * from user_resets where id=(select LAST_INSERT_ID())`
}




module.exports = { sendMail }

