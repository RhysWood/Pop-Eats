$(document).ready(function() {


  //button that shows or hides the new-tweet option
  const toggleOrders = document.getElementById('toggleOrders');

  toggleOrders.addEventListener('click', function() {
    $('.order-end').parent().toggleClass("done-row");
  });

});
