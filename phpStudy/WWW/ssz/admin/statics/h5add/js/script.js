/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-06-28 21:06:24
 * @version $Id$
 */



$(function(){
  $("#bars li .bar").each(function(key, bar){
    var percentage = $(this).data('percentage');

    $(this).animate({
      'height':percentage+'%'
    }, 1000);
  })
})
