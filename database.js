// const {db} = require('./dbpool');
// const db = require('./server')

//returns user from database
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
}


//Return all items on menu as array
const menuItems = (db) => {
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

//returns all items in an order
const orderItems = (orderID) => {
  const queryString = `
  SELECT items.title, items.price, orders_items.quantity
  FROM items
  JOIN orders_items on orders_items.item_id = items.id
  JOIN orders on orders.id = orders_items.order_id
  WHERE orders.id = $1
  GROUP BY items.title, items.price, orders_items.quantity;
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

const startOrder = (userID) => {
  const queryString = `
  INSERT INTO orders (user_id, submitted, start_date, end_date)
  VALUES($1, $2, $3, $4)
  RETURNING *;
  `;
  const values =[userID, false, ]
}

const addToOrder = (itemID, orderID) => {
  const queryString = `
  INSERT INTO orders_items
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
}


module.exports = {findUser, menuItems, allUsers, orderItems, orderCost};
