/**
 * Created by Nam on 24/2/2015.
 */
//$.noConflict();
$(function()
{
    $('a[data-toggle="tab"]').on('shown.bs.tab', function () {
        //save the latest tab; use cookies if you like 'em better:
        localStorage.setItem('lastTab', $(this).attr('data-target'));
        console.log(localStorage.getItem('lastTab'));
    });

    //go to the latest tab, if it exists:
    var lastTab=localStorage.getItem('lastTab');
    if (lastTab) {
        $('a[data-target=' + lastTab + ']').tab('show');
    }
    else
    {
        // Set the first tab if cookie do not exist
        $('a[data-toggle="tab"]:first').tab('show');
    }
});

//
//$(function()
//{
//    jQuery('a[data-toggle="tab"]').on('shown.bs.tab', function(){
//
//        //save the latest tab using a cookie:
//        jQuery.cookie('last_tab', $(this).attr('data-target'));
//        console.log(localStorage.getItem('last_tab'));
//    });
//
////activate latest tab, if it exists:
//    var lastTab = jQuery.cookie('last_tab');
//    if (lastTab) {
//        $('a[data-target=' + lastTab + ']').tab('show');
//    }
//    else
//    {
//        // Set the first tab if cookie do not exist
//        $('a[data-toggle="tab"]:first').tab('show');
//        console.log("dkm");
//    }
//});







//$(document).ready(function() {
//    if(location.hash) {
//        $('a[data-target=' + location.hash + ']').tab('show');
//    }
//    $(document.body).on("click", "a[data-toggle=tab]", function(event) {
//        location.hash = this.getAttribute("data-target");
//        console.log(window.location.hash);
//    });
//});
//$(window).on('popstate', function() {
//    var anchor = location.hash || $("a[data-toggle=tab]").first().attr("data-target");
//    $('a[data-target=' + anchor + ']').tab('show');
//});


//
//$(document).ready(function() {
//    var lastTab = $.cookie('last_tab');
//
//// if last seen tab was stored in cookie
//    if(typeof(lastTab) !== "undefined") {
//        $('a[data-target=' + lastTab + ']').tab('show');
//    }
//});
//
//// event to capture tab switch
//$('a[data-toggle="tab"]').on('shown.bs.tab', function () {
//    event.preventDefault();
////save the latest tab using a cookie:
//    $.cookie('last_tab', this.getAttribute("data-toggle"), { path: '/' });
//    console.log('last_tab ' + $.cookie('last_tab'));
//});
