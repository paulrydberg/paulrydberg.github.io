var keywordArray = [
  "Kittens",
  "Nature",
  "Awesome",
  "Teenage Mutant Ninja Turtles"
];

function whenCustomButtonClicked() {
  $("#gifs-appear-here").empty();
  var keyword = $(this).attr("data-name");
  var apiKey = "GqNNmS1MwQucP8B8uCRTvrhVTIpPFQ1j";
  var queryURL =
    "https://api.giphy.com/v1/gifs/search?q=" +
    keyword +
    "&api_key=" +
    apiKey +
    "&limit=10";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    var results = response.data;
    console.log(results);

    for (var i = 0; i < results.length; i++) {
      //console.log(results[i]);
      var gifDiv = $("<div>");

      var rating = results[i].rating;
      var ratingDiv = $("<div>").text("Rating: " + rating);
      var keywordImage = $("<img>");
      keywordImage.addClass("pointerHover");
      keywordImage.addClass("gif");
      keywordImage.attr("src", results[i].images.fixed_height_still.url);
      keywordImage.attr("data-animate", results[i].images.fixed_height.url);
      keywordImage.attr("data-still", results[i].images.fixed_height_still.url);
      keywordImage.attr("data-state", "still");
      keywordImage.attr("alt", "GIF-images");

      gifDiv.prepend(ratingDiv);
      gifDiv.prepend(keywordImage);
      gifDiv.addClass("forceInline");
      gifDiv.addClass("pictureSpacing");

      //gifDiv.addClass(results[i].id);
      $("#gifs-appear-here").append(gifDiv);
    }
    $(".gif").on("click", function(event) {
      var state = $(this).attr("data-state");

      if (state === "still") {
        $(this).attr("src", $(this).attr("data-animate"));
        $(this).attr("data-state", "animate");
      } else {
        $(this).attr("src", $(this).attr("data-still"));
        $(this).attr("data-state", "still");
      }
    });
  });
}

function renderButtons() {
  $("#keywords-list").empty();
  for (var i = 0; i < keywordArray.length; i++) {
    var addButton = $("<button>");
    var addDiv = $("<div>");
    addDiv.addClass("forceInline");
    addButton.addClass("keyword-button");
    addButton.addClass("btn");
    addButton.addClass("btn-dark");
    addButton.attr("data-name", keywordArray[i]);
    addButton.text(keywordArray[i]);
    $("#keywords-list").append(addDiv);
    $(addDiv).append(addButton);
  }
}

$("#add-keyword").on("click", function(event) {
  event.preventDefault();
  var keyword = $("#keyword-input")
    .val()
    .trim();
  var nothingTyped = "Please Type Something";

  if (keyword == "") {
    //alert(nothingTyped);
    console.log(nothingTyped);
  } else {
    keywordArray.push(keyword);
    renderButtons();
  }
});

$(document).on("click", ".keyword-button", whenCustomButtonClicked);

renderButtons();
