
if($('#temp_overlay').length == 0) {
  $( "body" ).append( "<div id='temp_overlay' style='z-index: 3; position:fixed; top:0; left:0; width:100%; height:100%; background-color:#fff;'></div>" );
}
flash();

function flash(){
 $('#temp_overlay')
  .show()  //show the hidden div
  .animate({opacity: 0.7}, 300)
  .fadeOut(300);
}
