$( document ).ready(function() {
    $("#quickbio").typed({
        strings: ["creative.^1000", "passionate.^1000", "a developer."],
        typeSpeed: 10,
        backSpeed: 20
    });
    $('a[href*=#]:not([href=#])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
            || location.hostname == this.hostname) {

            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
               if (target.length) {
                 $('html,body').animate({
                     scrollTop: target.offset().top,
                }, 1000);
                return false;
            }
        }
    });
    $('.skillbar').each(function(){
        $(this).find('.skillbar-bar').animate({
        width: $(this).attr('data-percent'),
    }, 2000);
    });
});
