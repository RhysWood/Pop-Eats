// Client facing scripts here
$(document).ready(function () {
  const $cart = $(`<aside>
                  <div class="cart-description"> You have item(s) in your cart</div>
                  <div class="total"> Your Total is <div class="cart-total-item"> </div> </div>
                  <div class="tax"></div>
                  <div class="subtotal"></div>
                </aside>`);

  $(".form-control").change(function () {
    $(".menu-container").append($cart);
    updateTotal(this);
  });

  $("button").on("click", function () {
    event.preventDefault();
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
    let row = $(quantityInput).parent().parent().parent();
    let price = row.children("#price").text();
    let quantity = $(quantityInput).val();
    let rowPrice = Number(price) * Number(quantity);

    row.children('#total').html(rowPrice.toFixed(2))


    // console.log($('#total').text());

    // console.log($('.table-row').children('#total').text());

    let subTotal = 0;
    $('.table-row').each(function () {
      subTotal += Number($(this).children('#total').text());
    })

    let total = subTotal.toFixed(2)
    // console.log(total);
    // console.log(subTotal.toFixed(2));
    $('.cart-total-item').text(total);
    // $(".menu-container").append($cart);
    // let test = row.children().each(function () {
    //   // console.log($('#total').text());
    //   let val = Number(row.children('#total').text());
    //   // console.log(val);
    //   subTotal += val;
    // })

    // console.log(subTotal);

    // $("#table-row").each(function () {
    //   subTotal += Number($(this).children("#total").text());

    // });

    // console.log(subtotal);






  };
});
