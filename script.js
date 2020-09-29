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
  
   
  });