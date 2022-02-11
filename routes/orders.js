const express = require('express');
const router  = express.Router();
const database = require('../database');
const { sendMessage } = require("../services/twilio");


router.get("/", (req, res) => {
  const id = req.session.user_id;
  database
    .findUser(id)
    .then((user) => {
      database.userOrders(id).then((orders) => {
        database.alluserOrderItems(id).then((items) => {
          const templateVars = { orders, items, user };
          res.render("orders", templateVars);
        });
      });
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
});

router.post("/", (req, res) => {
  const orderDetails = req.body;
  database.startOrder(req.session.user_id).then((orderInfo) => {
    const test = [];
    for (let key in orderDetails) {
      if(key !== 'paid') {
        test.push(database.addToOrder(key, orderInfo.id, orderDetails[key]["qty"]));
        console.log('test', test);
      }
      if(key === 'paid') {
        if(key) {
          database.setPaid(orderInfo.id);
        }
      }

    }

    Promise.all(test).then(info => {
      let orderID = info[0].order_id;
      database.orderItems(orderID).then((x) => {
        let message = '';
        if (x.length === 1) {
          message += `${x[0].sum} x ${x[0].title}`;
          return {message, orderID};
        }
        for (let i = 0; i < x.length; i++) {
          if (i === 0) {
            message += `${x[i].sum} x ${x[i].title},`;
          } else if (i === x.length - 1) {
            message += ` and ${x[i].sum} x ${x[i].title}!`
          } else {
            message += ` ${x[i].sum} x ${x[i].title},`;
          }
        }
        return {message, orderID};
      }).then((message) => {
        database.getUserFromOrder(message.orderID)
        .then((userInfo) => {
          const phoneNumber = userInfo.phone_number;
          const userName = userInfo.name;
          const msg = `Thank you for your order, ${userName}! Your order details are: ` + message.message;
          sendMessage(phoneNumber, msg);
        })
        database.findUser(1)
        .then((managementContact) => {
          const phoneNumber = managementContact.phone_number;
          const msg = `A new order has been submitted! Check the online portal for order details and to provide an updated prep-time estimate.`;
          sendMessage(phoneNumber, msg);
        })
      })
    })
  })

});

module.exports = router;
