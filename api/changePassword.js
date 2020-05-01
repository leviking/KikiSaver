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

        oldPassword = Buffer.from(req.body.oldPassword, 'base64').toString()
        
        const returnHash = (req) => {
            con.query(getHashedPass(req.body.username), (err, results, fields) => {
                if (err) {
                    res.status(400).send('err')
                    console.log(err)
                    return
                } else if (results.rowsMatched === 0) {
                    res.status(403).send('Your old password is incorrect!')
                    return
                } else {
                    console.log(results)
                    return results[0].password
                }
            })

        }
        const updatePasswordWithNewPassword = () => {
            con.query(noMagicLinkQuery(password, req.body.username), (error, results, fields) => {
                if (error) {
                    res.status(400).send('No match');
                    console.log(error)
                    return;
                } else if (results) {
                    res.status(200).send('Ok');
                }
            })
        }
            compare(oldPassword, returnHash(req), passCheck)
        encrypt(
            Buffer.from(req.body.newPassword, 'base64').toString(), 
            updatePasswordWithNewPassword()
        )
     }
}

const magicLinkQuery = (password, magicLink) => {
    return `UPDATE users SET password = '${password}' WHERE id = (
        SELECT user_id FROM user_resets WHERE reset_key = '${magicLink}' AND deleted_at IS null
        )`
}
const noMagicLinkQuery = (password, username) => {
    return `UPDATE users SET password = '${password}' WHERE username = '${username}'`
}
const destroyMagicQuery = resetLink => {
    return `UPDATE user_resets SET deleted_at = now() WHERE reset_key = '${resetLink}'`
}
const getHashedPass = (username) => {
    return `SELECT password from users WHERE username = '${username}'`
}

const hasMagicLink = req => !!req.body.magic

const destroyMagic = resetLink => {
    con.query(destroyMagicQuery(resetLink), (err, results, fields) => (err) ? console.log(err) : console.log(results))
}

resetEmitter.on('successfulReset', destroyMagic)
module.exports = { changePassword }