const { con } = require('./db')
const EventEmitter = require('events');
const resetEmitter = new EventEmitter();



const changePassword = (req, res) => {
    
    con.query()
    
    if (err) {
        console.log(err)
        res.status(400).send('err')
    } else {
        resetEmitter.emit('successfulReset', resetKey)            
    }
}

const hasMagicLink =  

resetEmitter.on('successfulReset', resetKey)
module.exports = { changePassword }
