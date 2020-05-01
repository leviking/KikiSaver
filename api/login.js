const path = require('path')
const fs = require('fs')
const { con } = require('./db')
const { compare } = require('./encrypt')
const {
    getLoginQuery,
    getAttendanceQuery,
    getAdminQuery
} = require('./queries')
const {
    writeSelfie,
    updateSelfieUrl
} = require('./selfie')
const EventEmitter = require('events');
const loginEmitter = new EventEmitter();

//ErrorHandler
//Login stuff
const sendLogin = (req, res) => res.sendFile(path.join(__dirname, '/../public/login.html'))

const logAttendance = (user, ip, gps, selfie, req, res) => {
    con.query(getAttendanceQuery(user.id, ip, gps), (err, results, fields) => {
        if (err) {
            console.log(err)
        } else {
            loginEmitter.emit('saveSelfie', req, res, user, selfie, user.first_name, loginEmitter)
        }
    })
}

const getPassword = (username, callback) => {
    con.query(`select password from users where username='${username}'`,
        (err, results) => {            
            if(err) {console.log(err)
            }else{
                callback(results[0].password)
            }
        }
    )
}

const getUser = (username, callback) => {
    con.query(`select * from users where username='${username}'`,
    (err, results) => {
        if(err) {
            console.log(err)
        } else {
            callback(results[0])
        }
    }
    )
}

const login = async (req, res) => {
    const compareWithPass = (loginPass, callback) => (dbPass) => {        
        compare(loginPass, dbPass, callback)
    }
    const decodedLoginPass =  Buffer.from(req.body.password, 'base64').toString()
    const loginAttendance = (ip, gps, selfie, res, req) => (user) => loginEmitter.emit('onLogin', user, ip, gps, selfie, res, req)

    const handleLogin = (results) => {
        results ?
        getUser(req.body.username, loginAttendance(req.ip, req.body.gps, req.files.selfie, req, res)) :
        res.status(401).send('Password incorrect')
    }
    
    getPassword(req.body.username, compareWithPass(decodedLoginPass, handleLogin))
}

const loginWithPassword = (req,res) => (password) => {
    con.query(getLoginQuery(req.body.username, password), (err, results, fields) => {
        if (err) {
            console.log(err)
        } else if (!results.length) {
            // username and password do not match!
            res.send(401, 'Password incorrect')
        } else {
            (results[0].is_admin == true) ?
            loginEmitter.emit('onAdmin', req, res):
                loginEmitter.emit('onLogin', results[0], req.ip, req.body.gps, req.files.selfie, req, res);
        }
    })
}
const sendAdmin = (req, res) => {
    if (con.query(getAdminQuery(req.headers.msuser, req.headers.mspass), (err, results, fields) => {
            if (err) console.log(err)
            if (!results.length || results[0].is_admin == false) {
                console.log({ results: results, status: 'not admin' });
                res.status(401).send('Not admin')
                return
            }
            res.redirect('/admin')
            res.sendFile(path.join(__dirname + '/../public/admin.html'))
        }))
        return
}
loginEmitter.on('onLogin', logAttendance)
loginEmitter.on('onAdmin', (req, res) => {
    //add auth
    res.set({ msuser: req.body.username, mspass: req.body.password }).sendFile(path.join(__dirname, '/../public/admin.html'))
})
loginEmitter.on('saveSelfie', writeSelfie)
loginEmitter.on('selfieWrite', updateSelfieUrl)
loginEmitter.on('loginSuccess', (req, res, selfiePath, username) => {
    res.status(200).send(JSON.stringify({ username: username, selfiePath: selfiePath }));
})

module.exports = { login, sendLogin, sendAdmin }