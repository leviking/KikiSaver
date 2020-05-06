const { con } = require('./db')
const EventEmitter = require('events');
const resetEmitter = new EventEmitter();
const { encrypt, compare } = require('./encrypt')


const changePassword = (req, res) => {
    
    if (hasMagicLink(req)) {

        const decodedNewPass = Buffer.from(req.body.newPassword, 'base64').toString()

        const updateMagicLinkPass = (magic) => (newPassword) => {
            con.query(magicLinkQuery(newPassword, magic), (err, results, fields) => {
                if (err) {
                    console.log(err)
                    res.status(400).send('err')
                    return
                } else {
                    if (results.affectedRows == 0) {
                        res.status(403).send('noKeyMatch')
                        return
                    }
                    resetEmitter.emit('successfulReset', magic)
                    res.status(200).send('ok')
                }
            })
        }
        encrypt(decodedNewPass, updateMagicLinkPass(req.body.magic))

    } else {

        const decodedOldPass =  Buffer.from(req.body.oldPassword, 'base64').toString()
        const compareWithPass = (loginPass, callback) => (dbPass) => {        
            compare(loginPass, dbPass, callback)
        }
        const getPassword = (username, callback) => {
            con.query(`SELECT password FROM users WHERE username = '${username}'`,
                (err, results) => {            
                    if (err) {
                        console.log(err)
                    } else {
                        callback(results[0].password)
                    }
                }
            )
        }
        const updateNoMagicLinkPass = (username) => (newPassword) => {
            con.query(updatePassQuery(newPassword, username), (err, results, fields) => {
                if (err) {
                    console.log(err)
                    res.status(400).send('err')
                    return
                } else if (results.affectedRows === 1) {
                    console.log('success');
                    res.status(200).send('Password Updated')                 
                }
            })
        }
        const handleLogin = (results) => {
            results ?
            encrypt(decodedOldPass, updateNoMagicLinkPass(req.body.username)) :
            res.status(401).send('Password incorrect')
        }
        getPassword(req.body.username, compareWithPass(decodedOldPass, handleLogin))
     }
}

const magicLinkQuery = (password, magicLink) => {
    return `UPDATE users SET password = '${password}' WHERE id = (
        SELECT user_id FROM user_resets WHERE reset_key = '${magicLink}' AND deleted_at IS null
        )`
}
const updatePassQuery = (password, username) => {
    return `UPDATE users SET password = '${password}' WHERE username = '${username}'`
}
const destroyMagicQuery = resetLink => {
    return `UPDATE user_resets SET deleted_at = now() WHERE reset_key = '${resetLink}'`
}

const hasMagicLink = req => !!req.body.magic

const destroyMagic = resetLink => {
    con.query(destroyMagicQuery(resetLink), (err, results, fields) => (err) ? console.log(err) : console.log(results))
}

resetEmitter.on('successfulReset', destroyMagic)
module.exports = { changePassword }
