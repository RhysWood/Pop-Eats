const express = require('express');
const router  = express.Router();
const database = require('../database');
const { sendMessage } = require("../services/twilio");

//main management of orders page
router.get("/", (req, res) => {
  const id = req.session.user_id;
  database
    .findUser(id)
    .then((user) => {
      if (user.is_owner) {
        database.findUser(id).then((user) => {
          database.allOrders().then((orders) => {
            database.allOrdersAllItems().then((items) => {
              database.allUsers().then(users => {
                const templateVars = { orders, items, user, users };
                res.render("manage", templateVars);
              })
            });
          });
        });
      } else {
        return res.status(401).send("error, wrong user");
      }
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
});

//updates order as complete with end-date
router.post("/:orderID", (req, res) => {
  const id = req.session.user_id || 1;
  database.findUser(id)
  .then(user =>{
    if(user.is_owner){
      database.setCompleted(req.params.orderID)
      .then(() => {
        database.getUserFromOrder(req.params.orderID)
        .then(user => {
          const phoneNumber = user.phone_number;
          const userName = user.name;
          const message = `Hello ${userName}! Your recent order with Pop.Eats is now complete and ready for pickup!`;
          sendMessage(phoneNumber, message);
          res.redirect('/manage');
        })
      })
    } else{
      return res.status(401).send('error, wrong user');
    }
  })
  .catch(err => {
    console.log(err.message)
    return null;
  })
});

//updates user with new time estimate from the restaurant
router.post("/time/:orderID", (req, res) => {
  const id = req.session.user_id || 1;
  database.findUser(id)
  .then(user =>{
    if(user.is_owner){
      database.setPrepTime(req.params.orderID, req.body.time)
      .then(times => {
        database.getUserFromOrder(req.params.orderID)
        .then(user => {
          const phoneNumber = user.phone_number;
          const userName = user.name;
          const prepTime = times.time;
          const message = `Hello ${userName}! Your recent order with Pop.Eats is estimated to be ready in ${prepTime} minutes. Please prepare for pickup!`;
          sendMessage(phoneNumber, message);
          res.redirect('/manage');
        })
      })
    } else{
      return res.status(401).send('error, wrong user');
    }
  })
  .catch(err => {
    console.log(err.message)
    return null;
  })
});


module.exports = router;
