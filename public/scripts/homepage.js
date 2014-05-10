var scrollBottom = $(window).scrollTop() + $(window).height();

$("document").ready(function(){
	$('#tryIt').click(function(){
		$('html').animate({
			scrollTop: $('.panelScreen').offset().top-50}, 800);
	});
});

$(document).ready(function(){
 $(window).scroll(function(){
  var y = $(window).scrollTop();
  if( y > 0 ){
      $("#top-shadow").css({'display':'block', 'opacity':y/100});
	  $("nav").css({'-webkit-box-shadow': '0 0 0 rgba(0, 0, 0, 0.4)'});
	  $("nav").css({'box-shadow': '0 0 0 rgba(0, 0, 0, 0.4)'});
  } else {
      $("#top-shadow").css({'display':'block', 'opacity':y/100});
  }
 });
})

$(document).ready(function(){	
        $(".fade").hide(0).fadeIn(800);

});

$("document").ready(function(){
	$('#demo').click(function(){
		$('html').animate({
			scrollTop: $('.demoShine').offset().top}, 800);
	});
});

$("document").ready(function(){
	$('#getStarted').click(function(){
		$('html').animate({
			scrollTop: '0px'}, 800);
	});
});

showDemo = function(){
$('#video_canvas').hide();
$('.demoShine').fadeIn(800,function(){
initShiny();
});
}

hideDemo = function() {
$('.demoShine').fadeOut(800);
}

