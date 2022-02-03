const express = require('express');
const router  = express.Router();


router.get('/:id', (req, res) => {
  console.log("Hello");
  req.session.user_id = req.params.id;
  //query the database based on the id
  //send the found user as a template variable to the page
  res.redirect('/');
});

module.exports = router;
