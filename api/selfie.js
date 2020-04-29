const path = require('path')
const fs = require('fs')
const { con } = require('./db')
const { getSelfieUpdateQuery } = require('./queries')


const getFileExtension = (mimetype) => {
    if (mimetype === 'image/png') {
        return '.png'
    } else if (mimetype === 'image/jpg'){
        return '.jpg'
    } else if (mimetype === 'image/jpeg') {
        return '.jpeg'
    } else {
        console.log('Wrong file type!!')
        return ''
    }
}

const selfieErrorHandler = (err) => console.log(err)
const writeSelfie = (req, res, user, selfie, username, loginEmitter) => {
    const timeCode = Date.now()
    const selfieFrontEnd = `/selfies/${user.username}/${timeCode}${getFileExtension(selfie.mimetype)}`
    const selfiePath = path.join(
        __dirname + 
        `/../public${selfieFrontEnd}`
        )
    fs.writeFile(selfiePath, selfie.data, selfieErrorHandler)
    loginEmitter.emit('selfieWrite', user, selfiePath)
    loginEmitter.emit('loginSuccess', req, res, selfieFrontEnd, username)
}

const updateSelfieUrl = (user, selfiePath) => {
    con.query(getSelfieUpdateQuery(user, selfiePath), selfieErrorHandler)
    con.query(`select * from attendance where user_id='${user.id}' order by created_at desc limit 1`, (err, res, f) => {
        if (err) console.log(err)
            //console.log(res[0])
    })
}

module.exports = {
    updateSelfieUrl,
    writeSelfie
}