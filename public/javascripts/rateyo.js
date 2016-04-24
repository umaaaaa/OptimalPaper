$(function(){
  $('#rateYo').rateYo({
    rating: 3,
    fullStar: true,
  });
  $('#rateYo').rateYo().on("rateyo.set", function(e, data){
    $('form .comment').remove();
    $('#rateYo').after('<label class="comment">コメント：<div><textarea  name="comment" placeholder="こめんと"></textarea></div></label>'); 
  })
});
