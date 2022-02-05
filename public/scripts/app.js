// Client facing scripts here
$(document).ready(function () {
  const $cart = $(`<aside>
                  <div><i class="fas fa-shopping-cart"> </i></div>
                  <div> YOUR CART: </div>
                  <br>
                  <div class="cart-description"> <div class="item-count"></div>item(s) </div>
                  <div class="total"> SUB-TOTAL: <div class="cart-total-item"> </div> </div>
                  <div class="tax">TAX: <div class="cart-tax"></div></div>
                  <br>
                  <div class="grand-total">TOTAL: <div class="cart-grand-total"></div></div>
                </aside>`);

  $(".add-btn").on("click", function () {
    event.preventDefault();
    if (!$('.form-control').val()) return;
    $(".menu-item-container").append($cart);

    let target = $(this)
      .parent()
      .parent()
      .children(".row-input")
      .children()
      .children()
      .children();

    updateTotal(target);
  });

  $("button").on("click", function () {
    event.preventDefault();
  });

  $(".remove-btn").on("click", function () {
    let inputQty = $(this)
      .parent()
      .parent()
      .children(".row-input")
      .children()
      .children()
      .children();
    inputQty.val("0");
    let target = $(this)
      .parent()
      .parent()
      .children(".row-input")
      .children()
      .children()
      .children();
    updateTotal(target);
  });

  // function recalculateCart() {
  //   var subtotal = 0;

  //   /* Sum up row totals */
  //   $("#table-row").each(function () {
  //     subtotal += parseFloat($(this).children("#total").text());
  //   });

  //   /* Calculate totals */
  //   var tax = subtotal * taxRate;
  //   var shipping = subtotal > 0 ? shippingRate : 0;
  //   var total = subtotal + tax + shipping;

  //   /* Update totals display */
  //   $(".totals-value").fadeOut(fadeTime, function () {
  //     $("#cart-subtotal").html(subtotal.toFixed(2));
  //     $("#cart-tax").html(tax.toFixed(2));
  //     $("#cart-shipping").html(shipping.toFixed(2));
  //     $("#cart-total").html(total.toFixed(2));
  //     if (total == 0) {
  //       $(".checkout").fadeOut(fadeTime);
  //     } else {
  //       $(".checkout").fadeIn(fadeTime);
  //     }
  //     $(".totals-value").fadeIn(fadeTime);
  //   });
  // }

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
      itemTotal += Number($(this).children(".row-input").children().children().children().val());
    });

    let total = subTotal.toFixed(2);
    let totalText = `$ ${total.toString()}`;

    let taxAmt = (taxRate * total).toFixed(2);
    let taxAmtText = `$ ${taxAmt.toString()}`

    let grandTotal = (Number(total) + Number(taxAmt)).toFixed(2);
    let grandTotalText = `$ ${grandTotal.toString()}`

    $(".cart-total-item").text(totalText);
    $('.cart-tax').text(taxAmtText);
    $('.cart-grand-total').text(grandTotalText);
    $('.item-count').text(itemTotal)

  };
});
