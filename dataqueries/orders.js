const {db} = require('../dbpool');

//All order queries

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
      // console.log('Order Items:');
      // console.log(res.rows);
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
  INSERT INTO orders (user_id, paid, start_date, end_date)
  VALUES($1, $2, CURRENT_TIMESTAMP, null)
  RETURNING *;
  `;
  const values =[userID, false];
  return db.query(queryString, values)
  .then((res) => {
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
    return res.rows[0];
  })
  .catch((err) => {
    console.log(err.message);
    return null;
  })
};

exports.addToOrder = addToOrder;

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
    return res.rows[0];
  })
  .catch((err) => {
    console.log(err.message);
    return null;
  })
};

exports.orderDetails = orderDetails;

//sets an order status as paid
const setPaid = (orderID) => {
  const values = [orderID];
  let queryString = `
  UPDATE orders
  SET paid = true
  WHERE id = $1
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

exports.setPaid = setPaid;

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

exports.allOrders = allOrders;

//show all orders, including final price and items
const allOrdersAllItems = () => {
  const queryString = `
  SELECT orders.id as orderid, items.title, items.price, items.time, users.name, sum(orders_items.quantity)
  from items
  JOIN orders_items on orders_items.item_id = items.id
  JOIN orders on orders.id = orders_items.order_id
  JOIN users on users.id = orders.user_id
  GROUP BY items.title, items.price, orders.id, items.time, users.name;
  `;
  return db.query(queryString)
   .then((res) => {
     if(res.rows[0]) {
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

exports.allOrdersAllItems = allOrdersAllItems;



module.exports = {orderItems, orderCost, orderPrepTime, setPrepTime, startOrder, addToOrder, orderDetails, setPaid, setCompleted, allOrders, allOrdersAllItems};
