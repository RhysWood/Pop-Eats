const { set } = require('express/lib/response');
const {db} = require('./dbpool');

//Return all users on website as array
const allUsers = () => {
  const queryString = `
  SELECT * from users
  GROUP BY id
  ORDER BY id;
  `;
  return db.query(queryString)
  .then((res) => {
    console.log('allUsers');
    return res.rows;
  })
  .catch((err) => {
    console.log(err.message);
    return null;
  })
};

exports.allUsers = allUsers;

//returns select user from database
const findUser = (userID) => {
  const queryString = `
  SELECT *
  FROM users
  WHERE id = $1`;
  const values = [userID];
  return db.query(queryString, values)
   .then((res) => {
     if(res.rows[0]) {
      // console.log('foundUser!');
      // console.log(res.rows[0])
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

exports.findUser = findUser;

//show all orders under the current user
const userOrders = (userID) => {
  const queryString = `
  SELECT *
  FROM orders
  WHERE user_id = $1
  ORDER BY start_date DESC;
  `;
  const values = [userID];
  return db.query(queryString, values)
   .then((res) => {
     if(res.rows[0]) {
      console.log('all orders!');
      console.log(res.rows)
      return res.rows;
     };
     console.log('User Not Found');
     return null;
   })
   .catch((err) => {
    console.log(err.message);
    return null;
  })
};


exports.userOrders = userOrders;

//show all orders, including final price and items under the current user
const alluserOrderItems = (userID) => {
  const queryString = `
  SELECT orders.id as orderid, items.title, items.price, items.time, sum(orders_items.quantity)
  from items
  JOIN orders_items on orders_items.item_id = items.id
  JOIN orders on orders.id = orders_items.order_id
  WHERE user_id = $1
  GROUP BY items.title, items.price, orders.id, items.time;
  `;
  const values = [userID];
  return db.query(queryString, values)
   .then((res) => {
     if(res.rows[0]) {
      console.log('all orders!');
      console.log(res.rows)
      return res.rows;
     };
     console.log('User Not Found');
     return null;
   })
   .catch((err) => {
    console.log(err.message);
    return null;
  })
};

exports.alluserOrderItems = alluserOrderItems;

const getUserFromOrder = (orderID) => {
  const queryString = `
  SELECT *
  FROM users
  JOIN orders on users.id = user_id
  WHERE orders.id = $1;
  `;
  const values = [orderID];
  return db.query(queryString, values)
   .then((res) => {
     if(res.rows[0]) {
      console.log('found user!');
      console.log(res.rows[0])
      return res.rows[0];
     };
     console.log('User Not Found');
     return null;
   })
   .catch((err) => {
    console.log(err.message);
    return null;
  })
}

exports.getUserFromOrder = getUserFromOrder;

//show all orders
const allOrders = () => {
  const queryString = `
  SELECT *
  FROM orders
  ORDER BY start_date DESC;
  `;
  return db.query(queryString)
   .then((res) => {
     if(res.rows[0]) {
      console.log('all orders!');
      console.log(res.rows)
      return res.rows;
     };
     console.log('User Not Found');
     return null;
   })
   .catch((err) => {
    console.log(err.message);
    return null;
  })
};


exports.userOrders = userOrders;

//show all orders, including final price and items
const allOrdersAllItems = () => {
  const queryString = `
  SELECT orders.id as orderid, items.title, items.price, items.time, sum(orders_items.quantity)
  from items
  JOIN orders_items on orders_items.item_id = items.id
  JOIN orders on orders.id = orders_items.order_id
  GROUP BY items.title, items.price, orders.id, items.time;
  `;
  return db.query(queryString)
   .then((res) => {
     if(res.rows[0]) {
      console.log('all orders!');
      console.log(res.rows)
      return res.rows;
     };
     console.log('User Not Found');
     return null;
   })
   .catch((err) => {
    console.log(err.message);
    return null;
  })
};

//update user details by passing in options object
const updateUser = (userID, options) => {
  const values = [userID];
  let queryString = `
  UPDATE users
  SET id = $1`;

  if(options.name) {
    values.push(`${options.name}`);
    queryString += `, name= $${values.length}`;
  }

  if(options.email) {
    values.push(`${options.email}`);
    queryString += `, email= $${values.length}`;
  }

  if(options.password) {
    values.push(`${options.password}`);
    queryString += `, password= $${values.length}`;
  }

  if(options.phone_number) {
  values.push(`${options.phone_number}`);
  queryString += `, phone_number= $${values.length}`;
  }

  if(options.is_owner) {
    values.push(`${options.is_owner}`);
    queryString += `, is_owner= $${values.length}`;
  }

  queryString += ` WHERE id = $1
  RETURNING *;`;
  return db.query(queryString, values)
   .then((res) => {
     if(res.rows[0]) {
      console.log('updated user!');
      console.log(res.rows[0])
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

exports.updateUser = updateUser;

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
    console.log('Added items to menu!');
    console.log(res.rows);
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
      console.log('updated menu item!');
      console.log(res.rows[0])
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

//deletes an item from the menu
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
    console.log('Removed item from active menu!');
    console.log(res.rows);
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
    console.log('Add item back to menu!');
    console.log(res.rows);
    return null;
  })
  .catch((err) => {
    console.log(err.message);
    return null;
  })
};

exports.reactivateMenuItem = reactivateMenuItem;

//returns all items in an order
const orderItems = (orderID) => {
  const queryString = `
  SELECT orders.id as orderid, items.title, items.price, sum(orders_items.quantity)
  from items
  JOIN orders_items on orders_items.item_id = items.id
  JOIN orders on orders.id = orders_items.order_id
  WHERE orders.id = $1
  GROUP BY items.title, items.price, orders.id;
  `;
  const values = [orderID];
  return db.query(queryString, values)
  .then((res) => {
    if(res.rows[0]) {
      console.log('Order Items:');
      console.log(res.rows);
      return res.rows;
    }
    console.log(`Order #${orderID} Empty`);
    return null;
  })
  .catch((err) => {
    console.log(err.message);
    return null;
  })
};


exports.orderItems = orderItems;

//returns total sum of all items in an order as an object
const orderCost = (orderID) => {
  const queryString = `
  SELECT sum(orders_items.quantity * items.price) from orders_items JOIN orders on orders.id = order_id JOIN items on item_id = items.id  WHERE orders.id = $1;
  `;
  const values = [orderID];
  return db.query(queryString, values)
  .then((res) => {
    if(res.rows[0]['sum'] !== null) {
      // console.log('Order Total:');
      //console.log(res.rows[0]);
      return res.rows[0];
    }
    console.log(`Order #${orderID} Empty`);
    return null;
  })
  .catch((err) => {
    console.log(err.message);
    return null;
  })
};

exports.orderCost = orderCost;

//return the total prep time of an order in minutes based on items in the order
const orderPrepTime = (orderID) => {
  const queryString = `
  SELECT sum(orders_items.quantity * items.time) from orders_items JOIN orders on orders.id = order_id JOIN items on item_id = items.id  WHERE orders.id = $1;
  `;
  const values = [orderID];
  return db.query(queryString, values)
  .then((res) => {
    if(res.rows[0]['sum'] !== null) {
      return res.rows[0];
    }
    console.log(`Order #${orderID} Empty`);
    return null;
  })
  .catch((err) => {
    console.log(err.message);
    return null;
  })
}

exports.orderPrepTime = orderPrepTime;

const setPrepTime = (orderID, newTime) => {
  const values = [newTime, orderID];
  let queryString = `
  UPDATE orders
  SET time = $1
  WHERE id = $2
  RETURNING *;`;
  return db.query(queryString, values)
   .then((res) => {
     if(res.rows[0]) {
      console.log('Time Updated!');
      console.log(res.rows[0])
      return res.rows[0];
     };
     console.log('User Not Found');
     return null;
   })
   .catch((err) => {
    console.log(err.message);
    return null;
  })
}

exports.setPrepTime = setPrepTime;

//initiates a new order item in the database
const startOrder = (userID) => {
  const queryString = `
  INSERT INTO orders (user_id, submitted, start_date, end_date)
  VALUES($1, $2, CURRENT_TIMESTAMP, null)
  RETURNING *;
  `;
  const values =[userID, false];
  return db.query(queryString, values)
  .then((res) => {
    console.log('Added Order!');
    console.log(res.rows);
    return res.rows[0];
  })
  .catch((err) => {
    console.log(err.message);
    return null;
  })
};

exports.startOrder = startOrder;

//adds an item from the cart to a specific order
const addToOrder = (itemID, orderID, quantity) => {
  const queryString = `
  INSERT INTO orders_items (item_id, order_id, quantity)
  VALUES($1, $2, $3)
  RETURNING *;
  `;
  const values = [itemID, orderID, quantity];
  return db.query(queryString, values)
  .then((res) => {
    console.log('Added items to Order!');
    console.log(res.rows);
    return res.rows[0];
  })
  .catch((err) => {
    console.log(err.message);
    return null;
  })
};

exports.startOrder = startOrder;

//deletes a specific item from the cart from a specific order
const removeFromOrder = (itemID, orderID) => {
  const queryString = `
  DELETE from orders_items
  WHERE item_id = $1
  AND order_id = $2
  RETURNING *;
  `;
  const values = [itemID, orderID];
  return db.query(queryString, values)
  .then((res) => {
    console.log('Removed items from Order!');
    console.log(res.rows);
    return null;
  })
  .catch((err) => {
    console.log(err.message);
    return null;
  })
};

exports.removeFromOrder = removeFromOrder;

//emptys the cart and discards the order in progress
const restartCart = (orderID) => {
  const queryString = `
  DELETE from orders_items
  WHERE order_id = $1
  RETURNING *;
  `;
  const values = [orderID];
  return db.query(queryString, values)
  .then((res) => {
    console.log('Discarded Order in Progress!');
    console.log(res.rows);
    return null;
  })
  .catch((err) => {
    console.log(err.message);
    return null;
  })
};

exports.restartCart = restartCart;

//retrieves all order details from a specific order
const orderDetails = (orderID) => {
  const queryString = `
  SELECT *
  FROM orders
  WHERE id = $1
  `;
  const values = [orderID];
  return db.query(queryString, values)
  .then((res) => {
    console.log('orderDetails');
    console.log(res.rows[0]);
    return res.rows[0];
  })
  .catch((err) => {
    console.log(err.message);
    return null;
  })
};

exports.orderDetails = orderDetails;

//sets an order status as submitted
const setSubmitted = (orderID) => {
  const values = [orderID];
  let queryString = `
  UPDATE orders
  SET submitted = true
  WHERE id = $1
  RETURNING *;`;
  return db.query(queryString, values)
   .then((res) => {
     if(res.rows[0]) {
      console.log('Submitted Order!');
      console.log(res.rows[0])
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

exports.setSubmitted = setSubmitted;

//sets an end date on an order as completed
const setCompleted = (orderID) => {
  const values = [orderID];
  let queryString = `
  UPDATE orders
  SET end_date = CURRENT_TIMESTAMP
  WHERE id = $1
  RETURNING *;`;
  return db.query(queryString, values)
   .then((res) => {
     if(res.rows[0]) {
      console.log('Ended Order!');
      console.log(res.rows[0])
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

exports.setCompleted = setCompleted;

module.exports = {allUsers, findUser, userOrders, alluserOrderItems, allOrders, allOrdersAllItems, getUserFromOrder, updateUser, menuItems, addMenuItem, editMenuItem, deleteMenuItem, orderItems, orderCost, startOrder, addToOrder, removeFromOrder, restartCart, orderDetails, setSubmitted, setCompleted, reactivateMenuItem, itemDetails, setPrepTime, orderPrepTime};
