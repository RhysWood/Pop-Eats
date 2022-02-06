// Client facing scripts here
$(document).ready(function () {
  const $cart = $(`<aside>
                  <div><i class="fas fa-shopping-cart"> </i></div>
                  <div> YOUR CART: </div>
                  <br>
                  <div class="cart-description"> <div class="item-count"></div> <div class="items-text">item(s)</div> </div>
                  <div class="total"> SUB-TOTAL: <div class="cart-total-item"> </div> </div>
                  <div class="tax">TAX: <div class="cart-tax"></div></div>
                  <br>
                  <div class="grand-total">TOTAL: <div class="cart-grand-total"></div></div>
                  <div><form action="/order" method="POST">
                  <button class="submit-btn"> SUBMIT ORDER</button>
                </form></div>
                </aside>`);

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
        .val()
    ) {
      return;
    }
    $(".menu-item-container").append($cart);

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

    if (!orderDetails[itemID]) {
      orderDetails[itemID] = {
        'itemID': itemID,
        'qty': qty
      }
    } else {
      orderDetails[itemID]['qty'] = qty;
    }


    // $(".submit-btn").on("click", function (event) {
    //   event.preventDefault();
    //   console.log(orderDetails);
    //   if(Object.keys(orderDetails).length === 0) {
    //     return alert(`You can't submit an empty order`)
    //   }
    //   // $.post('/orders', orderDetails);
    //   // window.location.href='/orders';
    // });

  });

  $(".remove-btn").on("click", function () {
    // if (!$(".form-control").val()) return;
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


  updateTotal = (quantityInput) => {
    let taxRate = 0.12;
    let row = $(quantityInput).parent().parent().parent().parent();
    let price = row.children("#whatever").children(".price").text();
    let quantity = $(quantityInput).val();
    let rowPrice = Number(price) * Number(quantity);

    row.children("#total").html(rowPrice.toFixed(2));

    let subTotal = 0;
    let itemTotal = 0;

    $(".table-row").each(function () {
      subTotal += Number($(this).children("#total").text());
      itemTotal += Number(
        $(this).children(".row-input").children().children().children().val()
      );
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
      console.log(orderDetails);
      if(Object.keys(orderDetails).length === 0) {
        return alert(`You can't submit an empty order`)
      }
      $.post('/orders', orderDetails);
      window.location.href='/orders';
    });
  };
});
