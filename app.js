const express = require('express')
const path = require('path')
const fileUpload = require('express-fileupload')
const db = require('./api/db')
const { login, sendLogin, sendAdmin } = require('./api/login')
const { sendSignup, createUser } = require('./api/sign-up')
const app = express()
const port = 3000

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

// 404 Not found stuff
app.get('*', (req, res) => res.status(404).sendFile(path.join(__dirname, 'public', '404.html')))

//LISTEN
app.listen(port, () => console.log(`Example app listening on port ${port}!`))