const db = require('./server')

const testFunc = () => {
  const queryString = `SELECT * FROM users WHERE id = $1`;
  const values = [4];
  return db.query(queryString, values)
   .then((res) => {
     console.log('hi');
     console.log(res.rows[0].id)
   })
}

testFunc();
