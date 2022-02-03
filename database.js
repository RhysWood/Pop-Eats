const { user } = require('pg/lib/defaults');
const {db} = require('./dbpool');
// const db = require('./server')


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
      console.log('foundUser!');
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

//show all orders under the current user
const userOrders = (userID) => {
  const queryString = `
  SELECT orders
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


//const updateUser;


//Return all items on menu as array
const menuItems = () => {
  const queryString = `
  SELECT * from items
  GROUP BY id
  ORDER BY id;
  `;
  return db.query(queryString)
  .then((res) => {
    console.log('menuItems');
    return res.rows;
  })
  .catch((err) => {
    console.log(err.message);
    return null;
  })
};

// const addMenuItem;
// const editMenuItem;
// const deleteMenuItem;

//returns all items in an order
const orderItems = (orderID) => {
  const queryString = `
  SELECT items.title, items.price, sum(orders_items.quantity)
  from items
  JOIN orders_items on orders_items.item_id = items.id
  JOIN orders on orders.id = orders_items.order_id
  WHERE orders.id = 3
  GROUP BY items.title, items.price;
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

//initites a new order item in the database
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

// const orderDetails;
// const setSubmitted;
// const setCompleted;

module.exports = {allUsers, findUser,userOrders, menuItems, orderItems, orderCost, startOrder, addToOrder, removeFromOrder, restartCart};
