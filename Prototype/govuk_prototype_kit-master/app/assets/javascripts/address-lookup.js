/**
 * Created by angelovas on 04/09/2015.
 */


$(document).ready(function() {
    $("#find-address").click(function(){
        $("#address-list-group").removeClass("js-hidden");
    });

    $('select[name="address"]').change(function(){
        $("#address-list-group").addClass("js-hidden");
        $("#address-details-group").removeClass("js-hidden");
        $("#address1").val("30A Culver Road");
        $("#town").val("St Albans");
        $("#county").val("Hertfordshire");
        $("#country").val("United Kingdom");

    });

    $("#address-manual").click(function() {
        $("#address-details-group").removeClass("js-hidden");
    });

    $("#find-address-alt").click(function(){
        $("#address-list-group-alt").removeClass("js-hidden");
    });

    $('select[name="address-alt"]').change(function(){
        $("#address-list-group-alt").addClass("js-hidden");
        $("#address-details-group-alt").removeClass("js-hidden");
        $("#address1-alt").val("30A Culver Road");
        $("#town-alt").val("St Albans");
        $("#county-alt").val("Hertfordshire");
        $("#country-alt").val("United Kingdom");

    });

    $("#address-manual-alt").click(function() {
        $("#address-details-group-alt").removeClass("js-hidden");
    });

});
