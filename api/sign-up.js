const path = require('path')
const { con } = require('./db')
    //Sign up stuff
const sendSignup = (req, res) => res.sendFile(path.join(__dirname + '/../public/signup.html'))
const getSignupQuery = (username, password) => `insert into users(username, password, created_at) values ('${username}', '${password}', now())`
const createUser = (req, res) => {
    con.query(getSignupQuery(req.body.username, req.body.password), function(error, results, fields) {
        if (error) {
            res.status(400).send(`${JSON.stringify(error)}.`);
            return;
        };
        if (results) res.redirect('/');
    })
}

module.exports = { sendSignup, createUser }