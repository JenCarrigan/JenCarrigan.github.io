// ------------------------------------------------------------------------------
// Countries Array
// Used in dropdown to determine which country we're changing our amounts to
// ------------------------------------------------------------------------------

var countries = [{
    "name": "Japanese Yen",
    "val": "JPY"
  }, {
    "name": "Bulgarian Yev",
    "val": "BGN"
  }, {
    "name": "Czech Koruna",
    "val": "CZK"
  }, {
    "name": "Danish Krone",
    "val": "DKK"
  }, {
    "name": "Pound Sterling",
    "val": "GBP"
  }, {
    "name": "Hungarian Forint",
    "val": "HUF"
  }, {
    "name": "Polish Zloty",
    "val": "PLN"
  }, {
    "name": "Romanian Leu",
    "val": "RON"
  }, {
    "name": "Swedish Krona",
    "val": "SEK"
  }, {
    "name": "Swiss Franc",
    "val": "CHF"
  }, {
    "name": "Icelandic Krona",
    "val": "ISK"
  }, {
    "name": "Norwegian Krone",
    "val": "NOK"
  }, {
    "name": "Croatian Kuna",
    "val": "HRK"
  }, {
    "name": "Russian Rouble",
    "val": "RUB"
  }, {
    "name": "Turkish Lira",
    "val": "TRY"
  }, {
    "name": "Australian Dollar",
    "val": "AUD"
  }, {
    "name": "Brazilian Real",
    "val": "BRL"
  }, {
    "name": "Canadian Dollar",
    "val": "CAD"
  }, {
    "name": "Chinese Yuan",
    "val": "CNY"
  }, {
    "name": "Hong Kong Dollar",
    "val": "HKD"
  }, {
    "name": "Indonesian Rupiah",
    "val": "IDR"
  }, {
    "name": "Israeli Shekel",
    "val": "ILS"
  }, {
    "name": "Indian Rupee",
    "val": "INR"
  }, {
    "name": "South Korean Won",
    "val": "KRW"
  }, {
    "name": "Mexian Peso",
    "val": "MXN"
  }, {
    "name": "Malaysian Ringgit",
    "val": "MYR"
  }, {
    "name": "New Zealand Dollar",
    "val": "NZD"
  }, {
    "name": "Phillipine Piso",
    "val": "PHP"
  }, {
    "name": "Singapore Dollar",
    "val": "SGD"
  }, {
    "name": "Thai Baht",
    "val": "THB"
  }, {
    "name": "South African Rand",
    "val": "ZAR"
}];

// ------------------------------------------------------------------------------
// Country Dropdown Population
// ------------------------------------------------------------------------------

var countrySelect = document.getElementById('country');
for (var i = 0; i < countries.length; i++) {
    var country = countries[i];
    var opt = document.createElement("option");
    opt.textContent = country.name;
    opt.value = country.val;
    countrySelect.appendChild(opt);
}

// ------------------------------------------------------------------------------
// Date Compare
// Takes the user input dates to compare
// Returns true or false
// ------------------------------------------------------------------------------

function compare(date1, date2) {
    return new Date(date1) <= new Date(date2);
}

// ------------------------------------------------------------------------------
// Get Date Array
// Takes user input start and stop date
// Returns array of dates in between and including
// ------------------------------------------------------------------------------

var getDates = function(startDate, endDate) {
    var dates = [],
    currentDate = startDate,
    addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    };
    while (currentDate <= endDate) {
        dates.push(currentDate.getFullYear() + '-' + ("0" + (currentDate.getMonth() + 1)).slice(-2) + '-' + ("0" + currentDate.getUTCDate()).slice(-2));
        currentDate = addDays.call(currentDate, 1);
        console.log(currentDate);
    }
    console.log(dates);
    return dates;
};

// ------------------------------------------------------------------------------
// Create Chart
// Takes array of amounts and dates and creates horizontal bar chart
// Dates along vertical Y axis, amounts along horizontal X axis
// ------------------------------------------------------------------------------

function createChart(amts, dates) {
    
    var ctx = document.getElementById('currencyChart').getContext('2d');
    var currencyChart = new Chart (ctx, {
        type: 'horizontalBar',
        data: {
            labels: dates,
            datasets: [{
                label: "Converted Amount",
                data: amts,
                backgroundColor: '#190033',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Date"
                    },
                    ticks: {
                        beginAtZero: true
                        
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Amount"
                    },
                    ticks: {
                        beginAtZero: true,
                        callback: function(value, index, values) {
                            return '$' + value;
                        }
                    }
                }]
            }
            
        }
    });
}

$('#contactMe').click(function() {
    window.location.href='mailto:jen.d.carrigan@gmail.com?subject=Hi There!';
});

$('#github').click(function() {
    window.location.href='https://github.com/JenCarrigan';
});

// ------------------------------------------------------------------------------
// Click event
// listens for the submit click event
// ------------------------------------------------------------------------------
    
document.getElementById('dateSubmit').addEventListener('click', function(event) {

    var date1 = document.getElementById('dateInput1').value;
    var date2 = document.getElementById('dateInput2').value;
    var countrySubmit = document.getElementById('country').value;
    var results = document.getElementById('yourResults');
    var h2text = document.createTextNode("Your Results");
    var date = new Date(date1);
    console.log( new Date( date.getTime() - date.getTimezoneOffset() * -60000 )  );

    // ------------------------------------------------------------------------------
    // Compare
    // If the first date is before the second date, do stuff
    // If the first date is not before second date, alert user, refresh window
    // ------------------------------------------------------------------------------
    
    if(compare(date1, date2)) {
        
        $('#results').removeClass('hide');
        $('#results').children().addClass('hide');
        $($(this).attr('href')).removeClass('hide');
        
        results.appendChild(h2text);

        var datesArray = getDates(new Date(date1), new Date(date2));
        var amountsArray = [];
        
        // ------------------------------------------------------------------------------
        // Callback
        // Once the AJAX requests are completed, create the chart
        // ------------------------------------------------------------------------------

        getAmounts(function() {
            createChart(amountsArray, datesArray);
        });
        
        // ------------------------------------------------------------------------------
        // Get Amounts
        // Make GET requests to Exchange Rates API, requesting rates for each day in our
        // dates array. Input amounts into new array on success
        // ------------------------------------------------------------------------------

        function getAmounts(callback) {
            datesArray.forEach(function(date) {

                $.ajax({
                    type: 'GET',
                    url: 'https://api.exchangeratesapi.io/' + date + '?base=USD',
                    dataType: 'JSON',
                    success: function (data) {
                        amountsArray.push(Math.round(data.rates[countrySubmit] * 100) / 100);
                        callback();
                    },
                    error: function() {
                        console.log('Error' + data);
                    }
                });

            });  
        }
        
        // ------------------------------------------------------------------------------
        // Scroll To Event
        // Scroll slowly on click to results div
        // ------------------------------------------------------------------------------
        
        $('html,body').animate({
            scrollTop: $('#results').offset().top
        }, 'slow');
        
    }
    else {
        alert ("Error! Try again");
        window.location.reload();
    }

    event.preventDefault();
});

