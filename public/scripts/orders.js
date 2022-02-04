import { findUser, userOrders, orderItems } from '../../database';

$(document).ready(function() {

  const $orderDetails = function() {
    return
    `<aside>
  <div class="order-details">Items:</div>
  <div class="total"> Total Price: <div class="cart-total-item"> </div> </div>
</aside>`;
  };

  const createPopup = function() {
    return `
    <div class="popup">Click me!
    <span class="popuptext" id="myPopup">Popup text...</span>
    </div>
    `

  }
  const loadDetails = function() {


  }

  const fetchDetails = document.getElementById('orderDetails');
  fetchDetails.addEventListener('submit', function(event) {
    event.preventDefault();

    let route = $('orderDetails').attr('action');

    $.get(route).then(()=>loadDetails()).catch(error=>{console.log(error.message);});


    const text = document.getElementById('tweet-text').value;

    const errorCode = $('#errorCode');
    const error = $('#error');

    error.hide();
    if (text.length > 140) {
      error.remove();
      errorCode.append(`<p id='error'><i class="fa-solid fa-triangle-exclamation"></i>   Tweet Too Long!   <i class="fa-solid fa-triangle-exclamation"></i></p>`);
      $('#error').slideDown();
      return;
    }

    if (text.length === 0) {
      error.remove();
      errorCode.append(`<p id='error'><i class="fa-solid fa-triangle-exclamation"></i>   Please enter a tweet!   <i class="fa-solid fa-triangle-exclamation"></i></p>`);
      $('#error').slideDown();
      return;
    }

    let tweet = $(this).serialize();

  });

//   //create new order element for page
//   const createOrderElement = function(order) {
//     const { id, start_date, end_date } = order;

//     let orderBody = `<article class="order">
//     <header>
//       <div>
//         <p>${id}</p>
//       </div>
//     </header>
//     `;

//     orderItems(id)
//     .then(items => {
//       for(let item in items) {
//         orderbody += `
//         <div class= "order-content">
//         <p>${item.title}</p>
//         <p>${item.price}</p>
//         <p>${item.sum}</p>
//         </div>  `
//       }
//     });

//     let status = "Submitted";
//     if(end_date !== null) {
//       status = "Closed";
//     }

//     orderBody += `
//     <div>${start_date}</div>
//     <div>${status}</div>
//     `;

//     return orderBody;
//   };

//   //loops through an array of order objects, creating a new order and appending it to the front page
//   const renderOrders = function() {
//     let orderArray = getUserOrder();
//     for (const each of orderArray) {
//       const $newOrder = createOrderElement(each);
//       $('#orders-container').append($newOrder);
//     }
//   };

// //loads all orders in the user/orders database
//   // const loadOrders = function() {
//   //   findUser()
//   //   $.getJSON('/tweets', function(data) {
//   //     renderTweets(data);
//   //   });
//   // };

//   $(() => {
//     renderOrders();
//   });
});
