$( document ).ready(function() {
   $('#navbar').scotchPanel({
                    containerSelector: 'body',
                    direction: 'left',
                    duration: 400,
                    transition: 'ease',
                    clickSelector: '#toggle-nav',
                    distanceX: '200px',
                    enableEscapeKey: true
                });
	$("a").click(function(){
	  $(this).toggleClass("open");
	}); 
});
