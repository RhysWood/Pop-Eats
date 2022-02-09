$(document).ready(function () {

  //shows user drop-down menu;
  const userPress = document.getElementById('user');
  userPress.addEventListener('click', function() {
    if($('#dropDownMenu').is((":visible"))) {
      $('#dropDownMenu').hide();
    } else {
      $('#dropDownMenu').show();
    }
  });

  //accessibility Enter option
  userPress.addEventListener('keypress', function(e) {
    if(e.key === 'Enter') {
      if($('#dropDownMenu').is((":visible"))) {
        $('#dropDownMenu').hide();
      } else {
        $('#dropDownMenu').show();
      }
    }
  });
});
