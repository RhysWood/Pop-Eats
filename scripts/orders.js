import { findUser, userOrders, orderItems } from '../database';

$(document).ready(function() {

  const getUserOrder = function() {
    findUser(req.session.user_id)
    .then(user => {
      userOrders(user['id'])
      .then(items => {
        return items;
      })
    })
  }

  //create new order element for page
  const createOrderElement = function(order) {
    const { id, start_date, end_date } = order;

    let orderBody = `<article class="order">
    <header>
      <div>
        <p>${id}</p>
      </div>
    </header>
    `;

    orderItems(id)
    .then(items => {
      for(let item in items) {
        orderbody += `
        <div class= "order-content">
        <p>${item.title}</p>
        <p>${item.price}</p>
        <p>${item.sum}</p>
        </div>  `
      }
    });

    let status = "Submitted";
    if(end_date !== null) {
      status = "Closed";
    }

    orderBody += `
    <div>${start_date}</div>
    <div>${status}</div>
    `;

    return orderBody;
  };

  //loops through an array of order objects, creating a new order and appending it to the front page
  const renderOrders = function() {
    let orderArray = getUserOrder();
    for (const each of orderArray) {
      const $newOrder = createOrderElement(each);
      $('#orders-container').append($newOrder);
    }
  };

//loads all orders in the user/orders database
  // const loadOrders = function() {
  //   findUser()
  //   $.getJSON('/tweets', function(data) {
  //     renderTweets(data);
  //   });
  // };

  $(() => {
    renderOrders();
  });
});
