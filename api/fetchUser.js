const { con } = require('./db')
const EventEmitter = require('events');
const resetEmitter = new EventEmitter();

const fetchUser = (req, res) => {

    con.query(fetchUserQuery(req.params.id), (err, results, fields) => {
        if (err) {
            console.log(err);
            res.status(400).send('err')
        } else if (results) {
            console.log(results[0]);
        }
    })
}

const fetchUserQuery = resetKey => {
    return `SELECT * FROM users WHERE id = (SELECT user_id FROM user_resets WHERE reset_key = '${resetKey}' AND deleted_at is null LIMIT 1)`;
}
const resetKeyQuery = resetKey => {
    return `UPDATE user_resets SET deleted_at = now() WHERE reset_key = '${resetKey}'`;
}

// resetEmitter.on('successfulReset', resetKey)
module.exports = { fetchUser }