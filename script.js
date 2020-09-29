$(document).ready(function() {
    //Event listener for all button elements.
    $("#search-button").on("click", function() {
      var searchCity = $("#search-city").val();

      $("search-city").val("");

      searchClimate(searchCity);
    });

    $(".history").on("click", "li", function() {
        // In this case, the "this" keyword refers to the button that was clicked
        searchClimate($(this).text());
    });

    function listCities(text) {
        var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
        $(".history").append(li);
      }

      function searchClimate(searchCity) {
          // Performing our AJAX GET request
        $.ajax({
          type: "GET",
          url: "http://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&appid=3af88076e37153670ec76a89f5ecc44f&units=imperial",
          dataType: "json",
          success: function(data) {
            // create history link for this search
            if (history.indexOf(searchCity) === -1) {
              history.push(searchCity);
              window.localStorage.setItem("history", JSON.stringify(history));
        
              ListCities(searchCity);
            }
             
            // clear any old content
            $("#today").empty();

            // create html content for current weather
            var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
            var structure = $("<div>").addClass("structure");
            var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
            var humidity = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
            var fahrenheit = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " °F");
            var layout = $("<div>").addClass("layout");
            var photo = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
            
            // merge and add to page
            title.append(photo);
            cardBody.append(title, fahrenheit, humidity, wind);
            card.append(layout);
            $("#today").append(structure);

            // call follow-up api endpoints
            Forecast(searchCity);
            UVIndex(data.coord.lat, data.coord.lon);
            }
        });
     }

     function Forecast(searchCity) {
        $.ajax({
          type: "GET",
          url: "http://api.openweathermap.org/data/2.5/forecast?q=" + searchCity + "&appid=3af88076e37153670ec76a89f5ecc44f&units=imperial",
          dataType: "json",
          success: function(data) {
            // overwrite any existing content with title and empty row
            $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");
    
            // loop over all forecasts (by 3-hour increments)
            for (var i = 0; i < data.list.length; i++) {
              // only look at forecasts around 3:00pm
              if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                // create html elements for a bootstrap card
                var col = $("<div>").addClass("col-md-2");
                var card = $("<div>").addClass("card bg-primary text-white");
                var body = $("<div>").addClass("card-body p-2");
    
                var title = $("<h5>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
    
                var photo = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
    
                var p1 = $("<p>").addClass("card-text").text("Temp: " + data.list[i].main.temp_max + " °F");
                var p2 = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
    
                // merge together and put on page
                col.append(card.append(body.append(title, photo, p1, p2)));
                $("#forecast .row").append(col);
              }
            }
          }
        });
      }

   
  });