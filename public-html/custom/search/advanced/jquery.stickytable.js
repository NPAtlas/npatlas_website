jQuery(document).on('stickyTable', function() {
    if(navigator.userAgent.match(/Trident\/7\./)) {
      jQuery('.sticky-table').on("mousewheel", function (event) {
        console.log(event);
          event.preventDefault();
          var wd = event.originalEvent.wheelDelta;
          var csp = jQuery(this).scrollTop();
          jQuery(this).scrollTop(csp - wd);
      });
    }
    jQuery(".sticky-headers").scroll(function() {
        jQuery(this).find("table tr.sticky-row th").css('top', jQuery(this).scrollTop());
        jQuery(this).find("table tr.sticky-row td").css('top', jQuery(this).scrollTop());
    }).scroll();
    jQuery(".sticky-ltr-cells").scroll(function() {
        jQuery(this).find("table th.sticky-cell").css('left', jQuery(this).scrollLeft());
        jQuery(this).find("table td.sticky-cell").css('left', jQuery(this).scrollLeft());
    }).scroll();
    jQuery(".sticky-rtl-cells").scroll(function() {
        var maxScroll = jQuery(this).find("table").prop("clientWidth") - jQuery(this).prop("clientWidth");
        jQuery(this).find("table th.sticky-cell").css('right', maxScroll - jQuery(this).scrollLeft());
        jQuery(this).find("table td.sticky-cell").css('right', maxScroll - jQuery(this).scrollLeft());
    }).scroll();
});
jQuery( document ).ready(function(){
    jQuery( document ).trigger( "stickyTable" );
});
