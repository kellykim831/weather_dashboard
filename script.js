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
  
    function listCities(text) {
      var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
      $(".history").append(li);
    }
  
    