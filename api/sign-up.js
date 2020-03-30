const fs = require('fs')
const path = require('path')
const { con } = require('./db')
    //Sign up stuff
const sendSignup = (req, res) => res.sendFile(path.join(__dirname + '/../public/signup.html'))
const getSignupQuery = (username, password, firstName, lastName, phone) => `insert into users(username, password, first_name, last_name, phone, created_at) values ('${username}', '${password}','${firstName}', '${lastName}','${phone}', now())`

const createUserDir = (username) => {
    fs.mkdir(path.join(__dirname + `/../public/selfies/${username}`), {recursive: true}, (err) => console.log('ok'))}

const createUser = (req, res) => {
    con.query(getSignupQuery(req.body.username, req.body.password, req.body.firstName, req.body.lastName, req.body.phone), function(error, results, fields) {
        if (error) {
            res.status(400).send(`${JSON.stringify(error)}.`);
            return;
        };
        if (results) {
            createUserDir(req.body.username)
            res.redirect('/');
        }
    })
}
module.exports = { sendSignup, createUser } 