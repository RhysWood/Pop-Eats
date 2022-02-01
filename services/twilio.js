const {accountID, authToken, messagingID} = require('./acctID');

const twilio = require('twilio');
const client = new twilio(accountID, authToken);

const sendMessage = function(phoneNumber, message) {
  return client.messages
    .create({
      body: message,
      messagingServiceSid: messagingID,
      to: `+${phoneNumber}`
    })
    .then(message => console.log(message.sid))
    .catch((err) => {
      console.log(err.message);
      return null;
    })
    .done();
};

module.exports = {sendMessage};

//console.log(sendMessage('17783586873', 'Hello from trial run three!'));
