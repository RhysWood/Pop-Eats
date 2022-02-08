$(document).ready(function() {


  //button that shows or hides the new-tweet option
  const toggleOrders = document.getElementById('toggleOrders');

  toggleOrders.addEventListener('click', function() {
    $('.order-end').parent().toggleClass("done-row");
  });

    // button that marks completed on order when finished
    const detailsButton = document.getElementsByClassName('order-ended');
    for (let i=0; i < detailsButton.length; i++) {
      detailsButton[i].addEventListener('click', function() {
        console.log('button works!')
        const parent = $(this).parent();
        const endField = parent.children('.order-not-end');
        console.log(parent);
        console.log(endField);
        if (endField) {
          $(endField).text("Completed!")
        }
      });
    }
});
