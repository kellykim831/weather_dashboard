var key = "3af88076e37153670ec76a89f5ecc44f";
$(document).ready(function() {
    // Event listener for search button element
    $("#search-button").on("click", function() {
      var searchCity = $("#search-city").val();
  
      // clear input box
      $("#search-city").val("");
  
      searchClimate(searchCity);
    });
  
    $(".history").on("click", "li", function() {
    // In this case, the "this" keyword refers to the button that was clicked.
      searchClimate($(this).text());
    });
  
    //creating history list on the left side of the site
    function listCities(text) {
     
      $(".history").append($("<li>").addClass("list-group-item list-group-item-action").text(text));
    }
  
    function searchClimate(searchCity) {
    // Performing our AJAX GET request
      $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&appid=" + key + "&units=imperial",
        dataType: "json",
        //data is coming from the response of the url
    }).then(function (data) {
          // create history link for this search. Index of -1 means if city is not listed, add it to the list.
          if (history.indexOf(searchCity) === -1) {
            history.push(searchCity);
            window.localStorage.setItem("history", JSON.stringify(history));
      
            listCities(searchCity);
          }
          
          // clear any old content
          $("#today").empty();
  
          // create html content for current weather
          var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
          var card = $("<div>").addClass("card");
          // create a paragraph tag with the wind speed
          var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
          // create a paragraph tag with the humidity
          var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
          // create a paragraph tag with temperature
          var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " °F");
          var cardBody = $("<div>").addClass("card-body");
          // creating an image tag
          var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
  
          // merge and add to page
          title.append(img);
          cardBody.append(title, temp, humid, wind); 
          card.append(cardBody);
          $("#today").append(card);
  
          // call follow-up api endpoints
          forecast(searchCity);
          uvIndex(data.coord.lat, data.coord.lon);
        
    });
    }
    
    function forecast(searchCity) {
        // performing our AJAX GET request
      $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchCity + "&appid=" + key + "&units=imperial",
        dataType: "json",
    }).then(function (data) {
          // overwrite any existing content with title and empty row
          $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");
  
          // loop over all forecasts (by 3-hour increments)
          for (var i = 0; i < data.list.length; i++) {
            // only look at forecasts around 3:00pm
            if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
              // create html elements for a bootstrap card
              var col = $("<div>").addClass("col-md-2");
              var card = $("<div>").addClass("card bg-success mb-3 text-white");
              var body = $("<div>").addClass("card-body p-3");
  
              var title = $("<h5>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
  
              var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
  
              var p1 = $("<p>").addClass("card-text").text("Temp: " + data.list[i].main.temp_max + " °F");
              var p2 = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
  
              // merge together and put on page
              col.append(card.append(body.append(title, img, p1, p2)));
              $("#forecast .row").append(col);
            }
          }
        
      });
    }
  
    function uvIndex(lat, lon) {
      $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/uvi?appid=" + key + "&lat=" + lat + "&lon=" + lon,
        dataType: "json",
    }).then(function (data) {
          var uv = $("<p>").text("UV Index: ");
          var btn = $("<span>").addClass("btn btn-sm").text(data.value);
          

          var uvValue = data.value;
          switch(true) {
              case uvValue < 3:
                  btn.addClass("btn-success");
                  break;
              case uvValue < 7:
                  btn.addClass("btn-warning");
                  break;
              default: 
              btn.addClass("btn-danger");
              break;
          }
          
          $("#today .card-body").append(uv.append(btn));
        
      });
    }
  
    // get current history, if any
    //first get the existing history from local storage, if there isn't any, return an empty array.
    var history = JSON.parse(window.localStorage.getItem("history")) || [];
  
    
    if (history.length > 0) {
      searchClimate(history[history.length-1]);
    }
    // looping over every city that was input
    for (var i = 0; i < history.length; i++) {
      listCities(history[i]);
    }
  });
  
