const path = require('path')
const fs = require('fs')
const { con } = require('./db')
const EventEmitter = require('events');
const attendanceEmitter = new EventEmitter();

const getAttendanceRecords = (req, res) => {
  con.query(`SELECT created_at, selfie_url FROM attendance WHERE user_id=${req.body.user}`,
    (err, results, fields) => {
      if (err) {
        res.status(400).send(`${JSON.stringify(error)}.`);
        return;
      } 
      res.send(JSON.stringify(results))
    }
  )
}

module.exports = { getAttendanceRecords }