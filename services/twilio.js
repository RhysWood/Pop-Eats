const {accountID, authToken} = require('./acctID');

//const {db} = require('../db');

const twilio = require('twilio');
const client = new twilio(accountID, authToken);

// const sendMessage = function(id, message) {
//   return db
//   .query(`
//   SELECT phone_number
//   FROM users
//   WHERE id = $1
//   `, [id])
//   .then
// }

client.messages
      .create({
         body: 'Testing take 2?!',
         messagingServiceSid: 'MGed55daed1e16f5639267fce30c5ac8ab',
         to: '+17783586873'
       })
      .then(message => console.log(message.sid))
      .done();
