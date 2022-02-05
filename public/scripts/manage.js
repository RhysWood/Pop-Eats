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

  //hides all orders, except for open orders, and all details
  const showOnlyOpen = function() {
    if($('.order-end').is((":visible"))) {
      $('.order-end').parent().slideUp();
    };
  };

  $(() => {
    showOnlyOpen();
  });

  const markComplete = document.getElementsByClassName('mark-complete');

  console.log(markComplete);

  // for(let i = 0; i < markComplete.length; i++) {
  //   markComplete[i].addEventListener('submit', function(event) {
  //     console.log('found button!');
  //     event.preventDefault();
  //     event.stopImmediatePropagation();
  // })
  // };


});
