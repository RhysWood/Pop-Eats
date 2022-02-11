const express = require('express');
const router  = express.Router();
const database = require('../database');


router.get('/', (req, res) => {
  const id = req.session.user_id;
  database
    .findUser(id)
    .then((user) => {
      if (user.is_owner) {
        database.menuItems().then((items) => {
          const templateVars = { items };
          res.render("update-menu", templateVars);
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

//toggles a menu item
router.post("/toggle/:itemID", (req, res) => {
  const id = req.session.user_id || 1;
  database
    .findUser(id)
    .then((user) => {
      if (user.is_owner) {
        database.itemDetails(req.params.itemID).then((item) => {
          if (item.active) {
            database.deleteMenuItem(item.id).then(() => {
              res.redirect("/update-menu");
            });
          } else {
            database.reactivateMenuItem(item.id).then(() => {
              res.redirect("/update-menu");
            });
          }
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

//update a menu item
router.post("/update/:itemID", (req, res) => {
  const id = req.session.user_id || 1;
  database.findUser(id)
  .then(user =>{
    if(user.is_owner){
      database.editMenuItem(req.params.itemID, req.body)
      .then(() => {
          res.redirect('/update-menu');
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

//adds a menu item
router.post("/add/", (req, res) => {
  const id = req.session.user_id || 1;
  database.findUser(id)
  .then(user =>{
    if(user.is_owner){
      database.addMenuItem(req.body.title,req.body.description, req.body.price, req.body.rating, req.body.img_url, req.body.img_alt, req.body.time)
      .then(() => {
          res.redirect('/update-menu');
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
