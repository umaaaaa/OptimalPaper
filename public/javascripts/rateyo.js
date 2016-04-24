$(function(){
  $('#rateYo').rateYo({
    rating: 3,
    fullStar: true,
  });
  $('#rateYo').rateYo().on("rateyo.set", function(e, data){
    $('form .comment').remove();
    $('form .rate').remove();

    $('#rateYo').after('<label class="rate"><input type="hidden" name="rate" min=1 max=5 value='+data.rating+'></label>');
    $('#rateYo').after('<label class="comment">コメント：<div><textarea  name="comment" placeholder="こめんと"></textarea></div></label>'); 
  })
});
