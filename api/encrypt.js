const bcrypt = require('bcrypt');
const saltRounds = 10;
const EventEmitter = require('events');
// const encryptEmitter = new EventEmitter();


const encrypt = (password, encryptEmitter) => { 
  bcrypt.hash(password, saltRounds, function(err, hash) {
    if(err) console.log(err);
    
    
    console.log('encrypt ', password, hash);
    
    encryptEmitter.emit('encrypted', hash)
  });
}

// encryptEmitter.on('encrypted', (hash)=>console.log(hash))

module.exports = { encrypt }