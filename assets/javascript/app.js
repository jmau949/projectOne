const firebaseConfig = {
  apiKey: "AIzaSyCfITc5Pg5rZxa_yTvo3lhsOg79bNdmghY",
  authDomain: "runtrackdb.firebaseapp.com",
  databaseURL: "https://runtrackdb.firebaseio.com",
  projectId: "runtrackdb",
  storageBucket: "",
  messagingSenderId: "267990846579",
  appId: "1:267990846579:web:a9a0af5fed16bb0a"
};

firebase.initializeApp(firebaseConfig);


const database = firebase.database();
// var startTime = "";
// var endTime = "";
// var date = "";
// // var location = '';

var locationKey;

//Calling Date and time picker functions
$('.datepicker').datepicker();
$('.timepicker').timepicker();

//Function to display the map
function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -33.8688, lng: 151.2195 },
        zoom: 13,
        mapTypeId: 'roadmap'
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);


    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}

//This function will round the time to be able to compare with the API time info
function roundMinutes(dateinput) {
    dateinput.setHours(dateinput.getHours() + Math.round(dateinput.getMinutes() / 60));
    dateinput.setMinutes(0);
    dateinput.setSeconds(0);
    return date;
}

//Calling the weather function after enter is pressed
$(document).on("change", weatherUpdate);

function weatherUpdate() {
    $(".weather").empty();

    //This first search is to get the "Location Key" for the city

    var apikey = "zhjyjxaY1tSBmw9CZHiiY9nyCKp5Uh6M";

    var locationInput = $("#pac-input").val();
    var queryURL = "https://dataservice.accuweather.com/locations/v1/search?q=" + locationInput + "&apikey=" + apikey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (location) {
        var locationKey = location[0].Key;
        

        //After getting the "locationKey" This search will bring back the forecast for 12hours in the specified location
        var apikey = "zhjyjxaY1tSBmw9CZHiiY9nyCKp5Uh6M";
        var queryURL = "https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/" + locationKey + "?apikey=" + apikey;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (forecast) {

            //Initializing Masonry
            $(".weather").masonry({
                columnWidth: ".img-box",
                itemSelector: ".img-box",
                fitWidth: true
            });
          
            //Getting the date comparison to get the amount of data requested per time entered
            var startdateinput = new Date($("#date").val() + " " + $("#start-time").val());
            var enddateinput = new Date($("#date").val() + " " + $("#end-time").val());
            var currentdate = new Date();
            roundMinutes(startdateinput);
            roundMinutes(enddateinput);
            roundMinutes(currentdate);
            var arraystarts = parseInt((moment(currentdate).preciseDiff(startdateinput)).replace(/[A-Za-z$-]/g, ""));
            var totalhours = parseInt((moment(startdateinput).preciseDiff(enddateinput)).replace(/[A-Za-z$-]/g, ""));
            var arrayends = parseInt(arraystarts + totalhours);
            var forecastArray = forecast.slice(arraystarts-1, arrayends);
            forecastArray.forEach(element => {

                console.log(forecastArray);
                //This for loop is to make the IconPhrase all together that way will match with the picture name 
                //as it is on the folder images
                var imageSource = (element.IconPhrase).toLowerCase();
                var endthisloop = false;
                for (var i = 0; i < imageSource.length; i++) {
                    if (imageSource.charAt(i) === " " || imageSource.charAt(i) === "/" || imageSource.charAt(i) === "-" || imageSource.charAt(i) === "(" || imageSource.charAt(i) === ")") {

                        var imageSrc = imageSource.replace(/[^A-Z0-9]+/ig, "");

                        endthisloop = true;
                    }
                    else if (endthisloop === false) {
                        imageSrc = imageSource;
                    }
                }

                //Loading all the info per hour requested
                var weatherImg = $("<img>").attr("src", "assets/images/" + imageSrc + ".png");
                var imgbox = $("<div/>").attr({ class: "img-box" });
                imgbox.append(weatherImg);
                var weatherinfo = $("<div/>").attr({ class: "img-info" });
                imgbox.append(weatherinfo);
                var title = $("<p>").html("<b>" + (element.IconPhrase + "</b>"));
                var celsius = (5/9) * (element.Temperature.Value - 32);
                var temp = $("<p>").html("<b>Temp:</b> " + (element.Temperature.Value + "F°/" + celsius.toFixed(2) +"C°"));
                var precp = $("<p>").html("<b>Precipitations:</b> " + (element.PrecipitationProbability + "%"));
                var time = new Date(element.DateTime);
                var timedisplay = moment(time).format("ddd D - hA");

                var timedisplay1 = timedisplay.toString();
                var timedisplay2 = timedisplay1.slice(9)    
                weatherinfo.append(title);
                weatherinfo.append(temp);
                weatherinfo.append(precp);
                weatherinfo.append(timedisplay2);
                $(".weather").append(imgbox).masonry("appended", imgbox);
                $(".weather").masonry();

            });

            //Masonry library will arrange them in the center of the page from left to right
            $(".weather").imagesLoaded().done(function () {
                $(".weather").masonry({
                    columnWidth: ".img-box",
                    itemSelector: ".img-box",
                });
            })
        })
    })
};



$('#pac-input').on("blur", data);
function data(){
console.log($("#start-time").val().trim())
  var startTime = $("#start-time").val().trim();
  var endTime = $("#end-time").val().trim();
  var date = $("#date").val().trim();
  var location = $("#pac-input").val().trim();
  database.ref().push({
    startTime: startTime,
    endTime: endTime,
    date: date,
    location: location, 
});
}

M.AutoInit();