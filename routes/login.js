const express = require('express');
const router  = express.Router();

const database = require('../database');
//const {findUser} = require('../database');


router.get('/:id', (req, res) => {
  console.log("Hello");
  req.session.user_id = req.params.id;
  const templateVars = {user: database.findUser(req.session.user_id).name};
  //aquery the datbase based on the id
  //send the found user as a template variable to the page
  res.redirect('/');
});


module.exports = router;
