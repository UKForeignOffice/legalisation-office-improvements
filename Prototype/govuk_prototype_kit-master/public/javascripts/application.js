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

    populateTable(table_data);
    $('input[type=checkbox]').change(
        function(){
            filterTable(this);
        });
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
        '<label for="otherCountriesNumber">No. of documents</label>' +
        '<input type="number" id="otherCountriesNumber" name="otherCountriesNumber" value="" class="number"/>' +
        '</div>' +
        '<div class="col2">' +
        '<label for="otherCountries[1]">Country name (optional)</label>' +
        '<div class="typeahead-container">' +
        '<div class="typeahead-field">' +
        '<span class="typeahead-query">' +
        '<input type="text" id="otherCountries" name="otherCountries" value="" autocomplete="off" class="text country-autocomplete long validate tt-query" style="position: relative; vertical-align: top; background-color: transparent;">' +
        '</span>' +
        '</div>' +
        '</div>' +
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

    function processForm(e) {
        if (e.preventDefault) e.preventDefault();

        str = $('#search-main').val();
        var docs = searchStringInArray(str.toLowerCase());

        innerHTML = '<form class="form-group">'

        if (docs.length > 0) {
            for(i=0; i<docs.length; i++){
                innerHTML += '<label class="block-label"  for="checkbox'+i+'">' +
                '<input id="checkbox'+ i +'" type="checkbox" value="0">' + docs[i] +
                '</label>';
            }
            innerHTML += '</form>';
            $('#results').html(innerHTML);
        } else {
            $('#results').html('<p class="bold-medium">We found no documents which match your query.</p>');
        }
        return false;
    }

    var form = document.getElementById('search-form');
    if(form) {
        if (form.attachEvent) {
            form.attachEvent("submit", processForm);
        } else {
            form.addEventListener("submit", processForm);
        }
    }

    $('.tab-content input[type=checkbox]').change(function() {
        if(this.checked) {
            var innerHTML = $('#list-docs').html();
            innerHTML += '<tr id="'+$('label[for='+this.id+']').text().trim().replace(/ /g, '-')+'"><td>'+ $('label[for='+this.id+']').text().trim() +'</td></tr>';
            $('#list-docs').html(innerHTML);
        }else {
            $('tr#'+$('label[for='+this.id+']').text().trim().replace(/ /g, '-')).remove();
        }
    });
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

$(function(){
    var select = $('.country');
    var options = [
        "United Kingdom", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
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
        "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates",  "United States",
        "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
    ];

    for(var i = 0; i < options.length; i++) {
        var opt = options[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.append(el);
    }
});

//Mailcheck code

$.getScript("mailcheck/mailcheck.min.js", function(){

});

var domains = ['gmail.com', 'aol.com'];
var secondLevelDomains = ['hotmail']
var topLevelDomains = ["com", "net", "org"];

var superStringDistance = function(string1, string2) {
    // a string distance algorithm of your choosing
};


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




function showOption(id) {
    $('#'+id).addClass("in");
}


function getData(level){
    function Category(id,name,target){
        this.name = name;
        this.cID = id;
        this.target = target; //The ID of the div that this category opens.
    }

    var business =  new Category(1,'Business Documents','cat1');
    var court =     new Category(2,'Court Documents','cat2');
    var educational=new Category(3,'Educational Documents','cat3');
    var govDept =   new Category(4,'Government Department Documents','cat4');
    var general =   new Category(5,'General Registry Office Documents','cat5');
    var identity =  new Category(6,'Identity Documents','cat6');
    var legal =     new Category(7,'Legal Documents','cat7');
    var medical =   new Category(8,'Medical Documents','cat8');
    var personal =  new Category(9,'Personal Documents e.g. Financial or Employment','cat9');
    var petExport = new Category(10,'Pet Export Documents','cat10');
    var police =    new Category(11,'Police Documents','cat11');
    var religious = new Category(12,'Religious Documents','cat12');
    var translation=new Category(13,'Translation','cat13');
    var categories = [business,court,educational,govDept,general,identity,legal,medical,personal,petExport,police,religious,translation];

    function Document(id,category,name,certified,original,photocopy,soro,soia){
        this.dID =id;
        this.category =category;
        this.name = name;
        //Booleans
        this.certified = certified;
        this.original = original;
        this.photocopy = photocopy;
        this.soro = soro //soro stands for signed by an official from the register office
        this.soia = soia ;//signed by an official from the issuing authority
    }
    <!-- 1.Business Documents -->
    var articlesOfAssociation = new Document('1.1',business,'Articles of Association',true,false,false,false,true);
    var chamberOfCommerce     = new Document('1.2',business,'Chamber of Commerce',true,false,false,false,true);
    var certificateFreesale = new Document('1.3',business,'Certificate of Freesale',true,false,false,false,true);
    var certificateIncorporation = new Document('1.4',business,'Certificate of Incorporation',true,false,false,false,true);
    var certificateMemorandum = new Document('1.5',business,'Certificate of Memorandum ',true,false,false,false,true);
    var companiesHouse = new Document('1.6',business,'Companies House',true,false,false,false,true);
    var departmentBusiness = new Document('1.7',business,'Department of Business, Innovation and Skills (BIS)',true,false,false,false,true);
    var businessDocuments = [articlesOfAssociation,chamberOfCommerce,certificateFreesale,certificateIncorporation,certificateMemorandum,companiesHouse,departmentBusiness];


    <!-- 6. Identity Documents -->
    var certificateNaturalisation = new Document('6.1',identity,'Certificate of naturalisation',true,true,true,true,false);
    var certificateNoImpediment = new Document('6.2',identity,'Certificate of No Impediment',false,true,false,true,false);
    var drivingLicence = new Document('6.3',identity,'Driving Licence',true,true,true,true,false);
    var letterNoTrace = new Document('6.4',identity,'Letter of No Trace',true,true,true,true,false);
    var passport = new Document('6.5',identity,'Passport',true,true,true,true,false);
    var identityDocuments = [certificateNaturalisation,certificateNoImpediment,drivingLicence,letterNoTrace,passport];

    <!-- 12. Religious Document -->
    var baptismCertificate = new Document('12.1',religious,'Baptism Certificate',true,true,true,true,false);
    var religiousDocument = new Document('12.2',religious,'Religious Document',true,true,true,true,false);
    var religiousDocuments = [baptismCertificate,religiousDocument];




    switch (level){
        case '0'    : return categories;
        case 'cat1' : return businessDocuments;
        case 'cat6' : return identityDocuments;
        case 'cat12': return religiousDocuments;
        default: return false;
    }
}

function getDoc(id){
    var getCategory = id.toString().split("."); //e.g. get the 12 from 12.1
    var catID = getCategory[0];
    var category = getData('cat'+catID); //get the whole category of documents


    for(var c in category){
        if(category[c].dID==id){
            return category[c];
        }
    }

    return false;
}



function showCategories(){
    var categories= getData('0');
    var htmlString= "<h2 class='heading-medium' style='margin-top: 0px!important;'>Choose a document category</h2>";

    for(var c in categories){
        htmlString+="<button class='categoryButtons' onclick='showDocuments(`"+categories[c].target+"`)'>"+categories[c].name+"</button>";
    }
    $('#eligibility').html(htmlString);
}

function showDocuments(cat){
    var documents = getData(cat);
    if(documents!=false) {
        var htmlString = "<h2 class='heading-medium' style='margin-top: 0px!important;' >Choose a document</h2>";
    }
    else {
        htmlString = '';
    }
    for(var d in documents){
        htmlString+="<button class='documentButtons'  onclick='selectDocument(`"+documents[d].dID+"`)'>"+documents[d].name+"</button>";
    }

    $('#documents').html(htmlString);
}

function selectDocument(docID){
    hideSelection();
    var document = getDoc(docID);
    if(document!=false) {
        var htmlString = "<h2 class='heading-medium'>"+document.name+"</h2>";
        if(document.certified && !document.soia) {
            htmlString += "<p>Your " + document.name + " can be legalised if it has been certified</p>";
            htmlString += "<p>We accept the following documents, please select your preferred option:</p>";
            if (document.original && document.photocopy) {
                htmlString += "<div class='form-group'>" +
                "<form>" + " <label class='block-label' for='radio-1'>" +
                "<input id='radio-1' type='radio' name='radio-group' value='original'>" +
                "Your original " + document.name +
                "</label>" +
                "<label class='block-label' for='radio-2'>" +
                "<input id='radio-2' type='radio' name='radio-group' value='photocopy'>" +
                "A photocopy of your " + document.name +
                "</label>" +
                "</form>" +
                "</div>";
            }
            htmlString+= "<div class='form-group'>"+
            "<a onclick='checkCertify("+docID+")' class='big button'>Next</a>"+
            "<p><a onclick='showSelection()' class='link-back'>Back</a></p>"+
            "</div>";
        }

        if(!document.certified && document.soro){
            htmlString += "<p>Your " + document.name + " can be legalised.</p>";
            htmlString += "<p>We accept only accept the following document, please confirm that you will send us:</p>";
            htmlString += "<label class='block-label' for='checkbox-1' style='margin-bottom:20px'>"
            +"<input id='checkbox-1' type='checkbox' name='confirm' value='1'>"
            +"The original "+document.name+" signed by an official from the register office"
            +"</label>";

            htmlString+= "<div class='form-group'>"+
            "<a onclick='checkConfirm()' class='big button'>Next</a>"+
            "<p><a onclick='showSelection()' class='link-back'>Back</a></p>"+
            "</div>";
        }

        if(document.certified && document.soia){
            htmlString += "<p>Your " + document.name + " can be legalised.</p>";
            htmlString += "<p>We accept only accept the following document, please confirm that you will send us:</p>";
            htmlString += "<label class='block-label' for='checkbox-1' style='margin-bottom:20px'>"
            +"<input id='checkbox-1' type='checkbox' name='confirm' value='1'>"
            +document.name+" signed by an official from the issuing authority"
            +"</label>";

            htmlString+= "<div class='form-group'>"+
            "<a onclick='checkConfirm()' class='big button'>Next</a>"+
            "<p><a onclick='showSelection()' class='link-back'>Back</a></p>"+
            "</div>";
        }


    }
    else {
        htmlString = 'There has been an Error!';
    }
    $('#selected_Document').html(htmlString);

}

function hideSelection() {
    $('#eligibility').addClass("hide");
    $('#documents').addClass("hide");
    $('#selected_Document').removeClass("hide");
}
function showSelection() {
    $('#eligibility').removeClass("hide");
    $('#documents').removeClass("hide");
    $('#selected_Document').addClass("hide");

}

function checkCertify(docID){
    var document = getDoc(docID);
    if(document.certified){
        var htmlString = "<h2 class='heading-medium'>"+document.name+"</h2>";
        htmlString += "<p style='margin-bottom: 20px;'>Your "+document.name+" must be certified in the UK by a solicitor or notary public. " +
        "When the solicitor or notary public signs the document, they must:</p>";
        htmlString += "  <ul class='bulletPoints'> "+
        "<li>note the type of certification they have done (eg the document is a true copy of the original)</li>"+
        "<li>use their personal signature, not a company signature</li>"+
        "<li>include the date of certification</li>"+
        "<li>include their company address</li>"+
        "</ul>"+
        "<p>If they add a notarial certificate, it must be attached to the document. The certificate must also  contain a specific reference to the document they have certified.</p>"+
        "<p>If a notary public from England, Wales or Northern Ireland signs a document for legalisation, they must also stamp or emboss the document with their notarial seal.</p>";
        htmlString +=   "<p class='heading-small'>Has your document been certified in accordance with this guidance?</p>"+
        "<div class='form-group'>"+
        "<form id=`choice`>"+" <label class='block-label' for='radio-1'>"+
        "<input id='radio-1' type='radio' name='radio-group' value='yes'>"+
        "Yes"+
        "</label>"+
        "<label class='block-label' for='radio-2'>"+
        "<input id='radio-2' type='radio' name='radio-group' value='no'>"+
        "No"+
        "</label>"+
        "</form>"+
        "</div>";

        htmlString+= "<div class='form-group'>"+
        "<a onclick='eligibilityFinal("+docID+")' class='big button'>Next</a>"+
        "<p><a onclick='showSelection()' class='link-back'>Back</a></p>"+
        "</div>";


        $('#selected_Document').html(htmlString);
    }

}

function checkConfirm(){
    if($('input[name="confirm"]:checked').val() == '1'){
        document.location.href ='eligible_document';
    }
}

function eligibilityFinal(docID){
    var doc = getDoc(docID);

    if($('input[name="radio-group"]:checked').val() == 'yes')
    {
        document.location.href ='eligible_document';
    }
    else if($('input[name="radio-group"]:checked').val() == 'no'){
        var htmlString = "<h2 class='heading-medium' style='margin-top: 0px!important;' >How to get a document certified</h2>";
        htmlString += "<h2 class='heading-small'>"+doc.name+"</h2>";
        htmlString += " <p>Before you can submit your baptism certificate for legalisation it must be certified in the UK by a solicitor or notary public. Once it has been certified please come back and submit a new application.</p>"
        htmlString += " <p>When the solicitor or notary public signs the document, they must:</p>"
        htmlString += "<ul class=`bulletPoints`>"
        +"<li>note the type of certification they have done (eg the document is a true copy of the original)</li>"
        +"<li>use their personal signature, not a company signature</li>"
        +"<li>include the date of certification</li>"
        +"<li>include their company address</li>"
        +"</ul>"
        +"<p>If they add a notarial certificate, it must be attached to the document. The certificate must also  contain a specific reference to the document they have certified.</p>"
        +"<p>If a notary public from England, Wales or Northern Ireland signs a document for legalisation, they must also stamp or emboss the document with their notarial seal.</p>"
        +"<p>You can find:</p>"
        +"<ul class='bulletPoints'>"
        +"<li>"
        +"<p><a rel='external' href='http://www.lawsociety.org.uk/home.law'>solicitors in England and Wales</a></p>"
        +"</li>"
        +"<li>"
        +"<p><a rel='external' href='http://www.facultyoffice.org.uk/notary/find-a-notary/'>notaries public in England and Wales</a></p>"
        +"</li>"
        +"<li>"
        +"<p><a rel='external' href='http://www.lawscot.org.uk/'>solicitors and notaries public in Scotland</a></p>"
        +"</li>"
        +"<li>"
        +"<p><a rel='external' href='http://www.lawsoc-ni.org/'>solicitors and notaries public in Northern Ireland</a></p>"
        +"</li>"
        +"</ul>"
        +"</div>";

        htmlString +="<div  style='margin-top:45px; padding-top: 20px; border-top: 1px solid #dee0e2;'>"
        +"<a class='print' href='#'>Print this page</a> </div>  ";
        htmlString +="<div class='form-group' id=`confirm_email_div`>"
        +"<span class='form-label' >Send this information to my email address</span>"
        +"<input class='form-control' id=`email-confirm` type=`text`>"
        +"</div>";


        htmlString+="<a href='index' class='big button'>Finish</a>"+
        "<p><a onclick='showSelection()' class='link-back'>Back</a></p>"+
        "</div>";

        $('#selected_Document').html(htmlString);

    }
    else
    {}

}

function searchStringInArray (str) {
    strArray = [
        "	ACRO Police Certificate	",
        "	Affidavit	",
        "	Articles of Association	",
        "	Bank Statement	",
        "	Baptism Certificate	",
        "	Birth Certificate	",
        "	Certificate of Incorporation	",
        "	Certificate of Freesale	",
        "	Certificate of Memorandum	",
        "	Certificate of Naturalisation	",
        "	Certificate of No Impediment	",
        "	Chamber of Commerce Document"	,
        "	Change of Name Deed	",
        "	Civil Partnership Certificate	",
        "	Criminal Records Bureau (CRB) Document	",
        "	Criminal Records Check	",
        "	Companies House Document	",
        "	County Court Document	",
        "	Court Document	",
        "	Court of Bankruptcy Document	",
        "	Death Certificate	",
        "	Decree Nisi	",
        "	Decree Absolute	",
        "	Degree Certificate or Transcript (UK)	",
        "	Department of Business, Innovation and Skills (BIS) Document	",
        "	Department of Health Document	",
        "	Diploma	",
        "	Disclosure Scotland Document	",
        "	Doctor’s Letter	",
        "	Driving Licence	",
        "	Educational Certificate (UK)	",
        "	Export Certificate	",
        "	Family Division of the High Court of Justice Document	",
        "	Fingerprints Document	",
        "	Fit Note	",
        "	Government Issued Document	",
        "	Grant of Probate	",
        "	High Court of Justice Document	",
        "	HM Revenue and Customs (HMRC) Document	",
        "	Home Office Document	",
        "	Last Will and Testament	",
        "	Letter from an Employer	",
        "	Letter of Enrolment	",
        "	Letter of Invitation (to live in UK)	",
        "	Letter of No Trace	",
        "	Medical Report	",
        "	Marriage Certificate (UK GRO or UK Religious)",
        "	Name Change Deed or Document	",
        "	Passport	",
        "	Pet Export Document from the Department of Environment, Food and Rural Affairs (DEFRA)	",
        "	Police Disclosure Document	",
        "	Power of Attorney	",
        "	Probate	",
        "	Reference from an Employer	",
        "	Religious Document	",
        "	Sheriff Court Document	",
        "	Sick Note	",
        "	Statutory Declaration	",
        "	Medical Test Results	",
        "	Translation of a document	",
        "	Utility Bill	",
        "	Conversion of Civil Partnership to Marriage Certificate	",
        "	Coroners Report	",
        "	Cremation Certificate	",
        "	School Document	"];
    var resultsArray = [];

    for (var j=0; j<strArray.length; j++) {
        if(strArray[j].toLowerCase().search(str) > -1){
            resultsArray.push(strArray[j]);
        }
    }
    return resultsArray;
}


function isYourDocumentCertified() {
    if($('#radio-indent-1').is(':checked') && !$('#radio-indent-2').is(':checked')) {
        window.location.href = 'application_form_personal_details';
    } else if(!$('#radio-indent-1').is(':checked') && $('#radio-indent-2').is(':checked')) {
        window.location.href = 'eligibility_get_certified';
    } else {
        $('p.validation-message').text("Please confirm if your document has been certified in accordance with out guidance.")
    }
}

//My Documents option

function chooseDocument(id) {
    if($("#"+id).is(':checked')){
        selectedDocuments.push([($('label[for="' + id + '"]').text())]);
        selectedDocuments.push([id]);


    }
    else
    {
        removeDocChoice_check(id);
    }

    updateMyDocuments();

}

function updateMyDocuments(){
    if(selectedDocuments.length!=0){
        $("#myDocuments").addClass('in');
    }
    document.getElementById('myDocuments').innerHTML ="";
    var arrayLength = selectedDocuments.length;
    for (var i = 0; i < arrayLength; i+=2) {
        document.getElementById('myDocuments').innerHTML += '<div  class="myDocuments">' + selectedDocuments[i] +
        '<span style="float:right"><a id='+selectedDocuments[i+1]+' onclick="removeDocChoice_remove(this.id)">Remove</a></span></div>';
    }
}

function removeDocChoice_check(id){
    function removeItem(array, item){
        for(var i in array){
            if(array[i]==item){
                array.splice(i,2);
                break;
            }
        }
    }

    removeItem(selectedDocuments, $('label[for="' + id + '"]').text());
}

function removeDocChoice_remove(id){
    function removeItem(array, item){
        for(var i in array){
            if(array[i]==item){
                array.splice(i-1,2);
                break;
            }
        }
    }
    $("#"+id).attr('checked', false);
    $('label[for="' + id + '"]').removeClass('selected');
    removeItem(selectedDocuments, id);
    updateMyDocuments();

}


function dummyClick1(){
    if( $("#checkbox-1").is(':checked')) {
        $("#eligible_tag1").removeClass('hide');
        $("#myDocs").addClass('collapse');
        $("#Degree").addClass('in');
    }else{
        $("#eligible_tag1").addClass('hide');

    }
}

function dummyClick2(){
    if( $("#radio-indent-1").is(':checked')) {
        $("#eligible_tag2").removeClass('hide');
        $("#Degree").removeClass('in');
        $("#eligible_tag2").addClass('eligible_tag');
        document.getElementById('eligible_tag2').innerHTML = 'Document Eligible';
        $("#eligible_tag2").removeClass('certify_tag');
    }
}
function dummyClick3(){
    if( $("#radio-indent-2").is(':checked')) {
        $("#eligible_tag2").removeClass('hide');
        $("#eligible_tag2").removeClass('eligible_tag');
        $("#eligible_tag2").addClass('certify_tag');
        document.getElementById('eligible_tag2').innerHTML = 'Document Requires Certification';

    }
}

function chooseService() {
    var selectedService = $('input[type=radio]:checked').val();
    console.log(selectedService);

    if (selectedService=='Standard Postal') {
        window.location.href = 'application_eligibility_skip';
    } else if (selectedService=='Business Premium') {
        window.location.href = 'account_login_fasttrack';
    }else if (selectedService == 'FT Standard') {
        window.location.href = 'application_eligibility_skip';
    }else if (selectedService =='FT Business Premium') {
        window.location.href = 'account_documents';
    }else if (selectedService==('FT Drop Off')) {
        window.location.href = 'account_documents_MK';
    }
}

var count = 0 ;
$(".filter-form input[type=checkbox]").change(function() {
    var category = this.value.toLowerCase();

    if(this.checked) {
        $(".filter-results label").removeClass('js-hidden');
        $(".filter-results label[category="+category+"]").addClass('select');
        $( ".filter-results label" ).not( ".select" ).addClass('js-hidden');
        count++;
    } else {
        count--;
        if (count > 0) {
            $(".filter-results label[category=" + category + "]").removeClass('select').addClass('js-hidden');
        } else {
            $(".filter-results label").removeClass('js-hidden').removeClass('select');
        }
    }
});

var selectedDocCount = 0;
$('.filter-results input[type=checkbox]').change(function() {
    if(this.checked) {
        selectedDocCount++;
        $('#selected-doc-count1').text(""+selectedDocCount);
        $('#selected-doc-count2').text(""+selectedDocCount);
    } else {
        selectedDocCount--;
        $('#selected-doc-count1').text(""+selectedDocCount);
        $('#selected-doc-count2').text(""+selectedDocCount);
    }
});


function clearSelection() {
    $('.filter-form input[type=checkbox]').prop('checked', false);
    $(".filter-results label").removeClass('js-hidden').removeClass('select');
    count=0;
    populateTable(table_data);
}

var table_data=[
    {
        "Date":"20 September 2015",
        "Service":"Standard",
        "Name":"Joe Bloggs",
        "Reference":"IR-12345",
        "Status":"In Progress",
        "Action":"Continue"
    },
    {
        "Date":"19 September 2015",
        "Service":"Standard",
        "Name":"Mary Poppins",
        "Reference":"IR-54321",
        "Status":"Complete",
        "Action":"View"
    },
    {
        "Date":"01 August 2015",
        "Service":"Standard",
        "Name":"Dan Moody",
        "Reference":"IR-99999",
        "Status":"In Progress",
        "Action":"Continue"
    },
    {
        "Date":"01 August2015",
        "Service":"Premium",
        "Name":"Josephine Bloggs",
        "Reference":"IR-12345",
        "Status":"In Progress",
        "Action":"Continue"
    },
    {
        "Date":"10 July 2015",
        "Service":"Premium",
        "Name":"Andy Hamilton",
        "Reference":"IR-54321",
        "Status":"In Progress",
        "Action":"Continue"
    },
    {
        "Date":"09 July 2015",
        "Service":"Premium",
        "Name":"Mark Barlow",
        "Reference":"IR-99999",
        "Status":"In Progress",
        "Action":"Continue"
    },
    {
        "Date":"23 June 2015",
        "Service":"Drop-off",
        "Name":"Joe Bloggs",
        "Reference":"IR-12345",
        "Status":"Complete",
        "Action":"View"
    },
    {
        "Date":"20 June 2015",
        "Service":"Drop-off",
        "Name":"Joe Bloggs",
        "Reference":"IR-54321",
        "Status":"Complete",
        "Action":"View"
    },
    {
        "Date":"01 June 2015",
        "Service":"Drop-off",
        "Name":"Shaun Smith",
        "Reference":"IR-99999",
        "Status":"In Progress",
        "Action":"Continue"
    }
];

function populateTable(data){
    var content='';
    for(var i=0;i<data.length;i++){
        content+='<tr>'+
        '<td class="acc-summary-table-cell-date">'+data[i].Date+'</td>'+
        '<td class="acc-summary-table-cell-service">'+data[i].Service+'</td>'+
        '<td class="acc-summary-table-cell-name">'+data[i].Name+'</td>'+
        '<td class="acc-summary-table-cell-ref">'+data[i].Reference+'</td>'+
        '<td class="acc-summary-table-cell-status">'+data[i].Status+'</td>'+
        '<td class="acc-summary-table-cell-link">'+ getLink(data[i].Action)+'</td>'+
        '</tr>';
    }
    $('#summary-standard tbody').html(content);

}

function getLink(action){
    return '<a href="#">'+action+'</a>';
}

function get_filtered_table(table,givenkey,attr){
    switch(givenkey){
        case 'Service': {return cleanResult(find_in_object(table,{Service: attr})); }
        case 'Status': {return cleanResult(find_in_object(table,{Status: attr})); }

        default : console.log('Key Error:' +givenkey);
    }
    function cleanResult(result){
        var cleanArray=[];
        for(var i=0;i<result.length;i++){
            cleanArray.push(result[i]);
        }
        return cleanArray;
    }
    function find_in_object(my_object, my_criteria){

        return my_object.filter(function(obj) {
            return Object.keys(my_criteria).every(function(c) {
                return obj[c].replace(/ /g,'') == my_criteria[c];
            });
        });

    }
}

function filterTable(){
    var filteredTable=[];
    var unchecked=true;
    $('input[type=checkbox]').each(function () {
        if(this.checked) {
            filteredTable.push(get_filtered_table(table_data, this.name, this.value));
            unchecked=false;
        }

    });
    if(unchecked){
        return populateTable(table_data);
    }
    else {
        var collectedResult = [];
        for (var i = 0; i < filteredTable.length; i++) {
            for (var j = 0; j < filteredTable[0].length; j++) {
                collectedResult.push(filteredTable[i][j]);
            }
        }
        return populateTable(collectedResult);
    }
}


