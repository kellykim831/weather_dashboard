$(document).ready(function() {
    $("#search-button").on("click", function() {
      var searchCity = $("#search-city").val();

      $("search-city").val("");

      searchClimate(searchCity);
    });

    $(".history").on("click", "li", function() {
        searchClimate($(this).text());
    });

    function listCities(text) {
        var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
        $(".history").append(li);
      }

    
  
   
  });