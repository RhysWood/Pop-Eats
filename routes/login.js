const express = require('express');
const router  = express.Router();
const database = require('../database');
//const {findUser} = require('../database');


router.get('/:id', (req, res) => {
  req.session.user_id = req.params.id;
  const templateVars = {user: database.findUser(req.session.user_id).name};
  database.findUser(req.session.user_id)
  .then((response)=>{
    console.log(response)
    res.render('index', {user: response});
  } );
  //aquery the datbase based on the id
  //send the found user as a template variable to the page
});

module.exports = router;
