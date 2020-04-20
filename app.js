const express = require('express')
const path = require('path')
const fileUpload = require('express-fileupload')
const { login, sendLogin, sendAdmin } = require('./api/login')
const { sendSignup, createUser } = require('./api/sign-up')
const { getAttendanceRecords } = require('./api/attendance')
const app = express()
const port = 3000
const cors = require('cors')
const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(cors())

app.use(express.static('public'))
app.use(express.static('src'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// Login
app.get('/login', sendLogin)
app.post('/login', login)

//Sign up
app.get('/signup', sendSignup)
app.post('/signup', createUser)

//Admin stuff
app.get('/admin', sendAdmin)

//logout stuff
const sendIndex = (req, res) => { res.redirect('/') }

app.get('/logout', sendIndex)

// Testing
app.get('/ping', (req, res) => {
  res.send("pong")
})

//email
app.post('/reset', (req, res) => {
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
})

//attendance records
app.post('/attendance', getAttendanceRecords)


// 404 Not found stuff
app.get('*', (req, res) => res.status(404).sendFile(path.join(__dirname, 'public', '404.html')))


//LISTEN
app.listen(port, () => console.log(`Example app listening on port ${port}!`))