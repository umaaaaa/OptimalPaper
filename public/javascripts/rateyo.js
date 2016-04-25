$(function(){
  $('#rateYo').rateYo({
    rating: 3,
    fullStar: true,
  });
  $('#rateYo').rateYo().on("rateyo.set", function(e, data){
    $('form .comment').remove();
    $('form .rate').remove();

    $('#rateYo').after('<label class="rate"><input type="hidden" name="rate" min=1 max=5 value='+ data.rating +'></label>');
    $('#rateYo').after('<label class="comment">コメント：<div><textarea  class="form-control" rows="4" name="comment" style="resize: none;" placeholder="コメントを入力してください"></textarea></div></label>'); 
  })
});
