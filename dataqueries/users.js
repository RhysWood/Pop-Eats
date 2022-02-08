const {db} = require('../dbpool');

// All User Queries

//Return all users on website as array
const allUsers = () => {
  const queryString = `
  SELECT * from users
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

module.exports = {allUsers, findUser, userOrders,alluserOrderItems, getUserFromOrder, updateUser};
