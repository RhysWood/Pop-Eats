const {db} = require('./dbpool');
// const db = require('./server')

const testFunc = () => {
  const queryString = `SELECT * FROM users WHERE id = $1`;
  const values = [4];
  return db.query(queryString, values)
   .then((res) => {
     console.log('hi');
     console.log(res.rows[0].id)
   })
   .catch((err) => {
    console.log(err.message);
    return null;
  })
}

testFunc();

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

//Return all users on website as array
const allUsers = () => {
  const queryString = `
  SELECT * from users
  GROUP BY id
  ORDER BY id;;
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

