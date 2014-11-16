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
	$('#toggle-nav').click(function(){
	  $(this).toggleClass("open");
	});
    $(".intro").typed({
        strings: ["bold.^1000", "passionate.^1000", "creative.^1000", "a developer/designer."],
        typeSpeed: 10,
        backSpeed: 20
    }); 
});
