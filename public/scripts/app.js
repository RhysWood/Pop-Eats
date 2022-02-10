// Client facing scripts here
$(document).ready(function () {
  const $cart = $(`<aside id="cart">
                  <div><i class="fas fa-shopping-cart"> </i></div>
                  <div> YOUR CART: </div>
                  <br>
                  <div class="cart-description"> <div class="item-count"></div> <div class="items-text">item(s)</div> </div>
                  <div class="total"> SUB-TOTAL: <div class="cart-total-item"> </div> </div>
                  <div class="tax">TAX: <div class="cart-tax"></div></div>
                  <br>
                  <div class="grand-total">TOTAL: <div class="cart-grand-total" id="final-price"></div></div>
                  <div><form action="/order" method="POST">
                  <button class="submit-btn"> SUBMIT ORDER <br> Pay at Pickup</button>
                </form><div id="buy-now">Or Pay Now with Google Pay!</div></div>
                </aside>`);

  //order submitted popup
  const $orderSubmitted = $(`
                  <div id="submitPopup">
                  <div> Your Order Has Been Submitted! </div>
                  <br>
                  <div>You will now receive a confirmation text message with your order details and estimated time to fulfillment.</div>
                  <br>
                  <div> You will receive another text when your order is ready for pickup.</div>
                  <br>
                  <div>Thank you for your business. We hope you will order with us again soon.</div>
                </div>`);

  // Prevents user from submitting form on hitting 'enter' key
  $(window).keydown(function (event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });


  let orderDetails = {};

  // Event handler for 'Add' button to update the cart
  $(".add-btn").on("click", function (event) {
    event.preventDefault();

    if (
      !$(this)
        .parent()
        .parent()
        .children(".row-input")
        .children()
        .children()
        .children()
        .val() || $(this)
        .parent()
        .parent()
        .children(".row-input")
        .children()
        .children()
        .children()
        .val() == 0
    ) {
      return;
    }
    $(".menu-item-container").append($cart);
    onGooglePayLoaded();

    let target = $(this)
      .parent()
      .parent()
      .children(".row-input")
      .children()
      .children()
      .children();

    updateTotal(target);

    let qty = Math.floor(Number(
      $(this)
        .parent()
        .parent()
        .children(".row-input")
        .children()
        .children()
        .children()
        .val()
    ));

    let itemID = Number($(this).parent().parent().children(".items-id").text());

    if (!orderDetails[itemID]) {
      orderDetails[itemID] = {
        'itemID': itemID,
        'qty': qty
      }
    } else {
      orderDetails[itemID]['qty'] = qty;
    }
  });

  $(".remove-btn").on("click", function () {
    let inputQty = $(this)
      .parent()
      .parent()
      .children(".row-input")
      .children()
      .children()
      .children();
    inputQty.val(0);
    let target = $(this)
      .parent()
      .parent()
      .children(".row-input")
      .children()
      .children()
      .children();
    updateTotal(target);
    let qty = Number(
      $(this)
        .parent()
        .parent()
        .children(".row-input")
        .children()
        .children()
        .children()
        .val()
    );

    let itemID = Number($(this).parent().parent().children(".items-id").text());
    delete orderDetails[itemID];

  });


  const updateTotal = (quantityInput) => {
    let taxRate = 0.12;
    let row = $(quantityInput).parent().parent().parent().parent();
    let price = row.children("#whatever").children(".price").html().split('$').join('');

    let quantity = $(quantityInput).val();
    let rowPrice = Number(price) * Math.floor(Number(quantity));

    row.children("#total").html(rowPrice.toFixed(2));

    let subTotal = 0;
    let itemTotal = 0;

    $(".table-row").each(function () {
      subTotal += Number($(this).children("#total").text());
      itemTotal += Math.floor(Number(
        $(this).children(".row-input").children().children().children().val()
      ));
    });



    let total = subTotal.toFixed(2);
    let totalText = `$ ${total.toString()}`;

    let taxAmt = (taxRate * total).toFixed(2);
    let taxAmtText = `$ ${taxAmt.toString()}`;

    let grandTotal = (Number(total) + Number(taxAmt)).toFixed(2);
    let grandTotalText = `$ ${grandTotal.toString()}`;

    $(".cart-total-item").text(totalText);
    $(".cart-tax").text(taxAmtText);
    $(".cart-grand-total").text(grandTotalText);
    $(".item-count").text(itemTotal);

    $(".submit-btn").on("click", function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if(Object.keys(orderDetails).length === 0) {
        return alert(`You can't submit an empty order`)
      }

      $(".menu-item-container").append($orderSubmitted);

      // setTimeout(() => {
      //   $.post('/orders', orderDetails);
      //   window.location.href='/orders';
      // }, 10000);

      console.log(orderDetails);

      $.post('/orders', orderDetails);
      setTimeout(() => {
        window.location.href='/orders';
      }, 5000);

    });
  };
  //Google pay config

const tokenizationSpecification = {
  type: 'PAYMENT_GATEWAY',
  parameters: {
    gateway: 'example',
    gatewayMerchantId: 'exampleGatewayMerchantId',
  }
};

const basecardPaymentMethod = {
  type: 'CARD',
  parameters: {
    allowedCardNetworks: ['VISA', 'MASTERCARD'],
    allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
  }
};

const cardPaymentMethod = Object.assign(
  {tokenizationSpecification: tokenizationSpecification},
  basecardPaymentMethod
);

const googlePayConfiguration = {
  apiVersion: 2,
  apiVersionMinor: 0,
  allowedPaymentMethods: [cardPaymentMethod],
};

//Payments client

let googlePayClient;

//Function that runs when google pay is loaded

const onGooglePayLoaded = function() {
  googlePayClient = new google.payments.api.PaymentsClient({
    environment: 'TEST',
  });
  console.log('google pay loaded!')

  googlePayClient.isReadyToPay(googlePayConfiguration)
  .then(response => {
    if(response.result) {
      createAndAddButton();
    } else {
      //no button generated. Don't do anything.
    }
  })
  .catch(error => console.error('isReadyToPay error:', error));
};



//google pay button creation

function createAndAddButton() {
  const googlePayButton = googlePayClient.createButton({
    onClick: onGooglePayButtonClicked,
  })
  if(!(document.getElementsByClassName('gpay-card-info-container black long en')).length) {
    document.getElementById('buy-now').append(googlePayButton);
  }
};

function onGooglePayButtonClicked() {

  const paymentDataRequest = {... googlePayConfiguration };
  paymentDataRequest.merchantInfo = {
    merchantId: 'example',
    merchantName: 'Pop.Eats',
  };

  const price = document.getElementById('final-price');
  const priceTotal = ($(price).text()).slice(2);

  if(priceTotal <= 0) {
    return alert(`You can't submit an empty order`);
  }

  paymentDataRequest.transactionInfo = {
    totalPriceStatus: 'FINAL',
    totalPrice: priceTotal,
    currencyCode: 'CAD',
    countryCode: 'CA'
  };

  googlePayClient.loadPaymentData(paymentDataRequest)
  .then(paymentData => { processPaymentData(paymentData)
  })
  .catch(error => console.error('loadPaymentData error: ', error));
};

// import { orderDetails } from './app';

function processPaymentData(paymentData) {
  orderDetails['paid'] = true;
  console.log(paymentData);
  // $(".submit-btn").click();
  $(".menu-item-container").append($orderSubmitted);
  $.post('/orders', orderDetails);
  setTimeout(() => {
    window.location.href='/orders';
  }, 5000);
};

});
