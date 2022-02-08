// load .env data into process.env
require("dotenv").config();

const { db } = require("./dbpool");
const { sendMessage } = require("./services/twilio");

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieSession = require("cookie-session");

const database = require("./database");

// const homeRoute = require('./routes/users')

// PG database client/connection setup
// const { Pool } = require("pg");
// const dbParams = require("./lib/db.js");
// const db = new Pool(dbParams);
db.connect();

// const testFunc = () => {
//   const queryString = `SELECT * FROM users WHERE id = $1`;
//   const values = [4];
//   return db.query(queryString, values)
//    .then((res) => {
//      console.log(res.rows[0].id)
//    })
// }

// testFunc();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));
app.use((req, res, next) => {
  database.findUser(req.session.user_id).then((response) => {
    res.locals.user = response;
    return next();
  });
});

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const widgetsRoutes = require("./routes/widgets");
const { query } = require("express");
const login = require("./routes/login");
const { json } = require("express/lib/response");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// app.use("/api/users", usersRoutes(db));
app.get("/", (req, res) => {
  res.render("index");
  // db.query(`SELECT * FROM users;`)
  //   .then(data => {
  //     const users = data.rows;
  //     res.json({ users });
  //   })
  //   .catch(err => {
  //     res
  //       .status(500)
  //       .json({ error: err.message });
  //   });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/profile", (req, res) => {
  res.render("profile");
});

app.get("/logout", (req, res) => {
  res.clearCookie('session');
  res.redirect("/");
});

//app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

// app.get("/", (req, res) => {
//   res.render("index");
// });

// app.use('/', usersRoutes(db))
// app.get('/', (req, res) => {
//   res.render('home')
// })
app.use("/login", login);

app.get("/menu", (req, res) => {
  database.menuItems().then((items) => {
    // console.log(items);
    let templateVars = { items };
    res.render("menu", templateVars);
  });
});

app.get("/orders", (req, res) => {
  // //sets default user as user 1 for testing purposes
  const id = req.session.user_id || 1;
  database
    .findUser(id)
    .then((user) => {
      database.userOrders(id).then((orders) => {
        database.alluserOrderItems(id).then((items) => {
          const templateVars = { orders, items, user };
          // console.log('these are templatevars:', templateVars);
          res.render("orders", templateVars);
        });
      });
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
});

app.post("/orders", (req, res) => {
  const orderDetails = req.body;
  console.log(req.body);
  database.startOrder(req.session.user_id).then((orderInfo) => {
    // console.log("***********", orderInfo);
    const test = [];
    for (let key in orderDetails) {
      if(key !== 'paid') {
        test.push(database.addToOrder(key, orderInfo.id, orderDetails[key]["qty"]));
        console.log('test', test);
      }
      if(key === 'paid') {
        if(key) {
          database.setPaid(orderInfo.id);
        }
      }

    }

    // console.log('test', test);
    Promise.all(test).then(info => {
      console.log('hi', info);
      let orderID = info[0].order_id;
      database.orderItems(orderID).then((x) => {
        let message = '';
        if (x.length === 1) {
          message += `${x[0].sum} x ${x[0].title}`;
          return {message, orderID};
        }
        for (let i = 0; i < x.length; i++) {
          if (i === 0) {
            message += `${x[i].sum} x ${x[i].title},`;
          } else if (i === x.length - 1) {
            message += ` and ${x[i].sum} x ${x[i].title}!`
          } else {
            message += ` ${x[i].sum} x ${x[i].title},`;
          }
        }
        return {message, orderID};
      }).then((message) => {
        database.getUserFromOrder(message.orderID)
        .then((userInfo) => {
          // console.log('line 169', userInfo);
          const phoneNumber = userInfo.phone_number;
          const userName = userInfo.name;
          const msg = `Thank you for your order, ${userName}! Your order details are: ` + message.message;
          // console.log('username', userName, 'Phone', phoneNumber, msg);
          // sendMessage(phoneNumber, msg);
        })
        database.findUser(1)
        .then((managementContact) => {
          const phoneNumber = managementContact.phone_number;
          const msg = `A new order has been submitted! Check the online portal for order details and to provide an updated prep-time estimate.`;
          //sendMessage(phoneNumber, msg);
        })
      })
    })
  })

});

app.get("/manage", (req, res) => {
  // //sets default user as user 1 for testing purposes
  const id = req.session.user_id || 1;
  database
    .findUser(id)
    .then((user) => {
      if (user.is_owner) {
        database.findUser(id).then((user) => {
          database.allOrders().then((orders) => {
            database.allOrdersAllItems().then((items) => {
              database.allUsers().then(users => {
                const templateVars = { orders, items, user, users };
                res.render("manage", templateVars);
              })
            });
          });
        });
      } else {
        return res.status(401).send("error, wrong user");
      }
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
});

app.post("/profile", (req, res) => {
  const id = req.session.user_id;
  console.log("THIS IS MY LOG:" + JSON.stringify(req.body));
  database.updateUser(id, req.body).then((result) => {
    res.redirect("/profile");
  });
});

//updates order as complete with end-date
app.post("/manage/:orderID", (req, res) => {
  const id = req.session.user_id || 1;
  database.findUser(id)
  .then(user =>{
    if(user.is_owner){
      console.log(req.params);
      database.setCompleted(req.params.orderID)
      .then(() => {
        database.getUserFromOrder(req.params.orderID)
        .then(user => {
          const phoneNumber = user.phone_number;
          const userName = user.name;
          const message = `Hello ${userName}! Your recent order with Pop.Eats is now complete and ready for pickup!`;
          sendMessage(phoneNumber, message);
          res.redirect('/manage');
        })
      })
    } else{
      return res.status(401).send('error, wrong user');
    }
  })
  .catch(err => {
    console.log(err.message)
    return null;
  })
});

app.post("/manage/time/:orderID", (req, res) => {
  const id = req.session.user_id || 1;
  database.findUser(id)
  .then(user =>{
    if(user.is_owner){
      console.log(req.params);
      database.setPrepTime(req.params.orderID, req.body.time)
      .then(times => {
        database.getUserFromOrder(req.params.orderID)
        .then(user => {
          const phoneNumber = user.phone_number;
          const userName = user.name;
          const prepTime = times.time;
          const message = `Hello ${userName}! Your recent order with Pop.Eats is estimated to be ready in ${prepTime} minutes. Please prepare for pickup!`;
          sendMessage(phoneNumber, message);
          res.redirect('/manage');
        })
      })
    } else{
      return res.status(401).send('error, wrong user');
    }
  })
  .catch(err => {
    console.log(err.message)
    return null;
  })
});

app.get('/update-menu', (req, res) => {
  // //sets default user as user 1 for testing purposes
  const id = req.session.user_id || 1;
  database
    .findUser(id)
    .then((user) => {
      if (user.is_owner) {
        database.menuItems().then((items) => {
          // console.log(items);
          const templateVars = { items };
          res.render("update-menu", templateVars);
        });
      } else {
        return res.status(401).send("error, wrong user");
      }
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
});

//deletes a menu item
app.post("/update-menu/toggle/:itemID", (req, res) => {
  const id = req.session.user_id || 1;
  database
    .findUser(id)
    .then((user) => {
      if (user.is_owner) {
        database.itemDetails(req.params.itemID).then((item) => {
          if (item.active) {
            database.deleteMenuItem(item.id).then(() => {
              res.redirect("/update-menu");
            });
          } else {
            database.reactivateMenuItem(item.id).then(() => {
              res.redirect("/update-menu");
            });
          }
        });
      } else {
        return res.status(401).send("error, wrong user");
      }
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
});

//update a menu item
app.post("/update-menu/update/:itemID", (req, res) => {
  const id = req.session.user_id || 1;
  database.findUser(id)
  .then(user =>{
    if(user.is_owner){
      console.log(req.body);
      database.editMenuItem(req.params.itemID, req.body)
      .then(() => {
          res.redirect('/update-menu');
        })
    } else{
      return res.status(401).send('error, wrong user');
    }
  })
  .catch(err => {
    console.log(err.message)
    return null;
  })
});

//adds a menu item
app.post("/update-menu/add/", (req, res) => {
  const id = req.session.user_id || 1;
  database.findUser(id)
  .then(user =>{
    if(user.is_owner){
      console.log(JSON.stringify(req.body));
      database.addMenuItem(req.body.title,req.body.description, req.body.price, req.body.rating, req.body.img_url, req.body.img_alt, req.body.time)
      .then(() => {
          res.redirect('/update-menu');
        })
    } else{
      return res.status(401).send('error, wrong user');
    }
  })
  .catch(err => {
    console.log(err.message)
    return null;
  })
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
