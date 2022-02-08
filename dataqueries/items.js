const {db} = require('../dbpool');

//All menu item queries

//Return all items on menu as array
const menuItems = () => {
  const queryString = `
  SELECT * from items
  GROUP BY id
  ORDER BY id;
  `;
  return db.query(queryString)
  .then((res) => {
    return res.rows;
  })
  .catch((err) => {
    console.log(err.message);
    return null;
  })
};

exports.menuItems = menuItems;

//get details of a specific item
const itemDetails = (itemID) => {
  const queryString = `
  SELECT * from items
  WHERE items.id = $1
  GROUP BY id
  ORDER BY id;
  `;
  const values = [itemID];
  return db.query(queryString, values)
  .then((res) => {
    return res.rows[0];
  })
  .catch((err) => {
    console.log(err.message);
    return null;
  })
};

exports.itemDetails = itemDetails;

//adds a new menu item to the item list
const addMenuItem = (title, description, price, rating, img_url, img_alt, time) => {
  const queryString = `
  INSERT INTO items (title, description, price, rating, img_url, img_alt, active, time)
  VALUES($1, $2, $3, $4, $5, $6, TRUE, $7)
  RETURNING *;
  `;
  const values = [title, description, price, rating, img_url, img_alt, time];
  return db.query(queryString, values)
  .then((res) => {
    return res.rows[0];
  })
  .catch((err) => {
    console.log(err.message);
    return null;
  })
};

exports.addMenuItem = addMenuItem;

//edits the properties of a current menu item
const editMenuItem = (itemID, options) => {
  const values = [itemID];
  let queryString = `
  UPDATE items
  SET id = $1`;

  if(options.title) {
    values.push(`${options.title}`);
    queryString += `, title= $${values.length}`;
  }

  if(options.description) {
    values.push(`${options.description}`);
    queryString += `, description= $${values.length}`;
  }

  if(options.price) {
    values.push(`${options.price}`);
    queryString += `, price= $${values.length}`;
  }

  if(options.rating) {
  values.push(`${options.rating}`);
  queryString += `, rating= $${values.length}`;
  }

  if(options.img_url) {
  values.push(`${options.img_url}`);
  queryString += `, img_url= $${values.length}`;
  }

  if(options.img_alt) {
  values.push(`${options.img_alt}`);
  queryString += `, img_alt= $${values.length}`;
  }

  if(options.time) {
    values.push(`${options.time}`);
    queryString += `, time= $${values.length}`;
    }

  queryString += ` WHERE id = $1
  RETURNING *;`;
  return db.query(queryString, values)
   .then((res) => {
     if(res.rows[0]) {
      return res.rows[0];
     };
     console.log('User Not Found');
     return null;
   })
   .catch((err) => {
    console.log(err.message);
    return null;
  })
};

exports.editMenuItem = editMenuItem;

//deactives an item from the menu
const deleteMenuItem = (itemID) => {
  const queryString = `
  UPDATE items
  SET active = false
  WHERE id = $1
  RETURNING *;
  `;
  const values = [itemID];
  return db.query(queryString, values)
  .then((res) => {
    return null;
  })
  .catch((err) => {
    console.log(err.message);
    return null;
  })
};

exports.deleteMenuItem = deleteMenuItem;

//re-adds an item to the menu
const reactivateMenuItem = (itemID) => {
  const queryString = `
  UPDATE items
  SET active = true
  WHERE id = $1
  RETURNING *;
  `;
  const values = [itemID];
  return db.query(queryString, values)
  .then((res) => {
    return null;
  })
  .catch((err) => {
    console.log(err.message);
    return null;
  })
};

exports.reactivateMenuItem = reactivateMenuItem;

module.exports = {menuItems, addMenuItem, itemDetails, editMenuItem, deleteMenuItem, reactivateMenuItem};
