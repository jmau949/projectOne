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
$('.datepicker').datepicker();
$('.timepicker').timepicker();



function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -33.8688, lng: 151.2195},
      zoom: 13,
      mapTypeId: 'roadmap'
    });
  
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);

  
    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });
  
    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();
  
      if (places.length == 0) {
        return;
      }
  
      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];
  
      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
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



function roundMinutes(dateinput) {
    dateinput.setHours(dateinput.getHours() + Math.round(dateinput.getMinutes()/60));
    dateinput.setMinutes(0);
    return date;
}


$('#pac-input').on("change", weatherUpdate);

function weatherUpdate() {
    $(".weather").empty();
    //This first search is to get the "Key" for the city
    var apikey = "eXVmt0EGx4CKaAt3tX0S11lmwL4KJcVJ";
    var locationInput = $("#pac-input").val();
    var queryURL = "https://dataservice.accuweather.com/locations/v1/search?q=" + locationInput + "&apikey=" + apikey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (location) {
        console.log(location[0].Key);
        locationKey = location[0].Key;

        //After getting the "locationKey" This search will bring back the forecast for 12hours in the specified location
        var apikey = "eXVmt0EGx4CKaAt3tX0S11lmwL4KJcVJ";
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
            console.log(forecast);
            forecast.forEach(element => {
                //This for loop is to make the IconPhrase all together that way will match with the picture name 
                //as it is on the folder images
                var dateinput = new Date($("#date").val().trim() + " " + $("#starttime").val().trim());
                roundMinutes(dateinput);
                console.log(dateinput);
                var dateApi = new Date(element.DateTime);
                if (dateinput.getTime() === dateApi.getTime()) {
                    var imageSource = (element.IconPhrase).toLowerCase();
                    console.log(imageSource);
                    var endthisloop = false;
                    for (var i = 0; i < imageSource.length; i++) {

                        if (imageSource.charAt(i) === " " || imageSource.charAt(i) === "/" || imageSource.charAt(i) === "-") {
                            var imageSrc = imageSource.replace(/ /i, "");
                            endthisloop = true;
                        }
                        else if (endthisloop === false) {
                            imageSrc = imageSource;
                            console.log(imageSrc);
                        }
                    }
                    var weatherImg = $("<img>").attr("src", "assets/images/" + imageSrc + ".png");
                    var imgbox = $("<div/>").attr({ class: "img-box" });

                    imgbox.append(weatherImg);
                    var weatherinfo = $("<div/>").attr({ class: "img-info" });
                    imgbox.append(weatherinfo);
                    var title =  $("<p>").html("<b>" + (element.IconPhrase + "</b>"));
                    var temp = $("<p>").html("<b>Temp:</b> " + (element.Temperature.Value + "F°"));
                    var precp = $("<p>").html("<b>Precipitations:</b> " + (element.PrecipitationProbability + "%"));
                    weatherinfo.append(title);
                    weatherinfo.append(temp);
                    weatherinfo.append(precp);
                    $(".weather").append(imgbox).masonry("appended", imgbox);
                    $(".weather").masonry();
                }
            });
            $(".weather").imagesLoaded().done(function () {
                $(".weather").masonry({
                    columnWidth: ".img-box",
                    itemSelector: ".img-box",
                });
            })
        })
    })
};



$('#pac-input').on("change", data);
function data(){
console.log($("#starttime").val().trim())
  var startTime = $("#starttime").val().trim();
  var endTime = $("#endtime").val().trim();
  var date = $("#date").val().trim();
  var location = $("#pac-input").val().trim();
  database.ref().push({
    startTime: startTime,
    endTime: endTime,
    date: date,
    location: location, 
});
}



