function ShowHideContent() {
    var self = this;


    self.escapeElementName = function(str) {
        result = str.replace('[', '\\[').replace(']', '\\]')
        return(result);
    };

    self.showHideRadioToggledContent = function () {
        $(".block-label input[type='radio']").each(function () {

            var $radio = $(this);
            var $radioGroupName = $radio.attr('name');
            var $radioLabel = $radio.parent('label');

            var dataTarget = $radioLabel.attr('data-target');

            // Add ARIA attributes

            // If the data-target attribute is defined
            if (dataTarget) {

                // Set aria-controls
                $radio.attr('aria-controls', dataTarget);

                $radio.on('click', function () {

                    // Select radio buttons in the same group
                    $radio.closest('form').find(".block-label input[name=" + self.escapeElementName($radioGroupName) + "]").each(function () {
                        var $this = $(this);

                        var groupDataTarget = $this.parent('label').attr('data-target');
                        var $groupDataTarget = $('#' + groupDataTarget);

                        // Hide toggled content
                        $groupDataTarget.hide();
                        // Set aria-expanded and aria-hidden for hidden content
                        $this.attr('aria-expanded', 'false');
                        $groupDataTarget.attr('aria-hidden', 'true');
                    });

                    var $dataTarget = $('#' + dataTarget);
                    $dataTarget.show();
                    // Set aria-expanded and aria-hidden for clicked radio
                    $radio.attr('aria-expanded', 'true');
                    $dataTarget.attr('aria-hidden', 'false');

                });

            } else {
                // If the data-target attribute is undefined for a radio button,
                // hide visible data-target content for radio buttons in the same group

                $radio.on('click', function () {

                    // Select radio buttons in the same group
                    $(".block-label input[name=" + self.escapeElementName($radioGroupName) + "]").each(function () {

                        var groupDataTarget = $(this).parent('label').attr('data-target');
                        var $groupDataTarget = $('#' + groupDataTarget);

                        // Hide toggled content
                        $groupDataTarget.hide();
                        // Set aria-expanded and aria-hidden for hidden content
                        $(this).attr('aria-expanded', 'false');
                        $groupDataTarget.attr('aria-hidden', 'true');
                    });

                });
            }

        });
    }
    self.showHideCheckboxToggledContent = function () {

        $(".block-label input[type='checkbox']").each(function() {

            var $checkbox = $(this);
            var $checkboxLabel = $(this).parent();

            var $dataTarget = $checkboxLabel.attr('data-target');

            // Add ARIA attributes

            // If the data-target attribute is defined
            if (typeof $dataTarget !== 'undefined' && $dataTarget !== false) {

                // Set aria-controls
                $checkbox.attr('aria-controls', $dataTarget);

                // Set aria-expanded and aria-hidden
                $checkbox.attr('aria-expanded', 'false');
                $('#'+$dataTarget).attr('aria-hidden', 'true');

                // For checkboxes revealing hidden content
                $checkbox.on('click', function() {

                    var state = $(this).attr('aria-expanded') === 'false' ? true : false;

                    // Toggle hidden content
                    $('#'+$dataTarget).toggle();

                    // Update aria-expanded and aria-hidden attributes
                    $(this).attr('aria-expanded', state);
                    $('#'+$dataTarget).attr('aria-hidden', !state);

                });
            }

        });
    }
}

$(document).ready(function() {

    // Turn off jQuery animation
    jQuery.fx.off = true;

    // Use GOV.UK selection-buttons.js to set selected
    // and focused states for block labels
    var $blockLabels = $(".block-label input[type='radio'], .block-label input[type='checkbox']");
    new GOVUK.SelectionButtons($blockLabels);

    // Details/summary polyfill
    // See /javascripts/vendor/details.polyfill.js

    // Where .block-label uses the data-target attribute
    // to toggle hidden content
    var toggleContent = new ShowHideContent();
    toggleContent.showHideRadioToggledContent();
    toggleContent.showHideCheckboxToggledContent();

});

$(window).load(function() {

    // Only set focus for the error example pages
    if ($(".js-error-example").length) {

        // If there is an error summary, set focus to the summary
        if ($(".error-summary").length) {
            $(".error-summary").focus();
            $(".error-summary a").click(function(e) {
                e.preventDefault();
                var href = $(this).attr("href");
                $(href).focus();
            });
        }
        // Otherwise, set focus to the field with the error
        else {
            $(".error input:first").focus();
        }
    }

});

function moveOnMax(field,nextFieldID){
    if(field.value.length >= 2){
        document.getElementById(nextFieldID).focus();
    }
}


$(function() {
    var scntDiv = $('#countries-list');
    var i = $('#countries-list #row').size()/2;

    $('body').on('click', '#addScnt', function() {
        $('<div id="row">'+
        '<div class="col1"> ' +
        '<label for="otherCountries[1]">Country name</label>' +
        '<div class="typeahead-container">' +
        '<div class="typeahead-field">' +
        '<span class="typeahead-query">' +
        '<input type="text" id="otherCountries" name="otherCountries" value="" autocomplete="off" class="text country-autocomplete long validate tt-query" style="position: relative; vertical-align: top; background-color: transparent;">' +
        '</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="col2">' +
        '<label for="otherCountriesNumber">No. of documents</label>' +
        '<input type="number" id="otherCountriesNumber" name="otherCountriesNumber" value="" class="number"/>' +
        '</div>' +
        '<div id="remove-control"><a href id="remScnt">Remove</a></div>' +
        '</div>').appendTo(scntDiv);
        i++;
        return false;
    });

    $('body').on('click', '#remScnt', function() {
        if( i > 1 ) {
            $(this).parents('#row').remove();
            var sum = 0;
            $('body').find('.number').each(function () {
                sum += Number($(this).val());
            });
            $('#total').text(sum);
            i--;
        }
        return false;
    });

    $( "#tabs" ).tabs();
    $("section.more").tabs();
});


$(document).on('change blur keydown paste input', '.number', function () {
    var sum = 0;
    $('body').find('.number').each(function () {
        sum += Number($(this).val());
    });
    $('#total').text(sum);
});

$('#otherCountries').typeahead({
    order: "desc",
    source: {
        data: [
            "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
            "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh",
            "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia",
            "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burma",
            "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad",
            "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic", "Congo, Republic of the",
            "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti",
            "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador",
            "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
            "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Greenland", "Grenada", "Guatemala", "Guinea",
            "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India",
            "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
            "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan", "Laos",
            "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
            "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
            "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Mongolia", "Morocco", "Monaco",
            "Mozambique", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger",
            "Nigeria", "Norway", "Oman", "Pakistan", "Panama", "Papua New Guinea", "Paraguay", "Peru",
            "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Samoa", "San Marino",
            "Sao Tome", "Saudi Arabia", "Senegal", "Serbia and Montenegro", "Seychelles", "Sierra Leone",
            "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain",
            "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan",
            "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
            "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
            "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
        ]
    },
    callback: {
        onInit: function (node) {
            console.log('Typeahead Initiated on ' + node.selector);
        }
    }
});


$("#phone").intlTelInput({
    defaultCountry: "auto",
    geoIpLookup: function(callback) {
        $.get('http://ipinfo.io', function() {}, "jsonp").always(function(resp) {
            var countryCode = (resp && resp.country) ? resp.country : "";
            callback(countryCode);
        });
    },
    utilsScript: "public/javascripts/int-tel-num/utils.js" // just for formatting/placeholders etc
});


//Mailcheck code

$.getScript("mailcheck/mailcheck.min.js", function(){

});

var domains = ['gmail.com', 'aol.com'];
var secondLevelDomains = ['hotmail']
var topLevelDomains = ["com", "net", "org"];

var superStringDistance = function(string1, string2) {
    // a string distance algorithm of your choosing
}


$('#email').on('blur', function() {
    $(this).mailcheck({
        domains: domains,                       // optional
        secondLevelDomains: secondLevelDomains, // optional
        topLevelDomains: topLevelDomains,       // optional
        distanceFunction: superStringDistance,  // optional
        suggested: function(element, suggestion) {
            // callback code
        },
        empty: function(element) {
            // callback code
        }
    });
});

$(function() {
    $( "#tabs" ).tabs();
});