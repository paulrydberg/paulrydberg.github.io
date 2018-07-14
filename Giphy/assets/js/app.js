var keywordArray = [
  "Kittens",
  "Nature",
  "Awesome",
  "Teenage Mutant Ninja Turtles"
];

function whenCustomButtonClicked() {
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
    $("#gifs-appear-here").empty();

    for (var i = 0; i < results.length; i++) {
      //console.log(results[i]);
      var dataStill = results[i].images.fixed_height_still.url;
      var dataAnimate = results[i].images.fixed_height.url;
      var gifDiv = $(
        '<span data-still="' +
          dataStill +
          '" data-animate="' +
          dataAnimate +
          '" data-state="still" >'
      );

      var rating = results[i].rating;
      var ratingDiv = $("<div>").text("Rating: " + rating);
      var keywordImage = $("<img>");
      keywordImage.addClass("pointerHover");
      //keywordImage.attr("src", results[i].images.fixed_height_still.url);
      keywordImage.attr("src", results[i].images.fixed_height.url);
      gifDiv.prepend(ratingDiv);
      gifDiv.prepend(keywordImage);
      gifDiv.addClass("forceInline");
      gifDiv.addClass("pictureSpacing");

      //gifDiv.addClass(results[i].id);
      $("#gifs-appear-here").prepend(gifDiv);
    }
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).on("click", ".keyword-button", whenCustomButtonClicked);

//$(document).on("click", $(".gif"), function() {
$(".gif").on("click", function() {
  var test = $(this).data("animate");
  console.log(test);
});

//$(".gif").on("click", makeAnimated);

renderButtons();

// $(".gif").on("click", function() {
//   // STEP ONE: study the html above.
//   //var animatedURL = $(this).attr("data-animate");
//   var test = $(this).data("animate");
//   console.log(test);
// });

// function makeAnimated() {
//   var animatedURL = $(this).attr("data-animate");
//   var animatedURL2 = $(this).data("animate");
//   //console.log(animatedURL);
//   console.log(animatedURL2);
//   //alert($(this).data('animate'));

//   //console.log('test');
//   //var replaceAnimated = $("<img>");
//   //console.log(replaceAnimated);

//   //adds source to img and alt
//   //replaceAnimated.attr("src", animatedURL);
//   //replaceAnimated.attr("alt", "now its moving");
// }
// //console.log(makeAnimated);

// $(".gif").on("click", function() {
//   // STEP ONE: study the html above.
//   var animatedURL = $(this).attr("data-animate");
//   var test = $(this).data("animate");
//   console.log(test);
// });
