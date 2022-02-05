$(document).ready(function() {


  //button that shows or hides the new-tweet option
  const toggleOrders = document.getElementById('toggleOrders');

  toggleOrders.addEventListener('click', function() {
    if($('.order-end').is((":visible"))) {
      $('.order-end').parent().slideUp();
    } else {
      $('.order-end').parent().slideDown();
    }
      //document.getElementById('order-details').focus();
  });

    // button that shows/hides order details
    // const detailsButton = document.getElementsByClassName('tablerow');
    // for (let i=0; i < detailsButton.length; i++) {
    //   detailsButton[i].addEventListener('click', function() {
    //     if ($(`.order-details${i}`).is(":visible")) {
    //       $(`.order-details${i}`).slideUp();
    //     } else {
    //       $(`.order-details${i}`).slideDown();
    //     }
    //   });
    // }

  //hides all orders, except for open orders, and all details
  const showOnlyOpen = function() {
    if($('.order-end').is((":visible"))) {
      $('.order-end').parent().slideUp();
    };
    // for (let i=0; i < detailsButton.length; i++) {
    //   console.log('testing hiding details');
    //   console.log($(`.order-details${i}`).text());
    //   $(`.order-details${i}`).slideUp();
    // }
  };

  $(() => {
    showOnlyOpen();
  });


});
