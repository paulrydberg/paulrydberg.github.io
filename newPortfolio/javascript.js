//setInterval(changeFont);

// $(document).ready(function() {
// //   $(".changeFont").on({
// //     mouseenter: function() {
// //       $(this).css({
// //         "font-family": "Montserrat, sans-serif"
// //       });
// //     }
// //   });
// $(this).css({"font-family": "Montserrat, sans-serif"
// });

// $(document).ready(function() {
//   console.log("Javascript Loaded");

//   function displayOut() {
//     var x = document.getElementById("changeFont");

//     setTimeout(function() {
//       $(x).css({ "font-family": "Montserrat, sans-serif" });
//     }, 1000);
//   }

//   displayOut();
//   //setTimeout(displayOut());
//   //console.log("Timeout Activated");
// });

//console.log("Javascript Loaded");

var fontArray = [
  { "font-family": "Roboto Mono, monospace" },
  { "font-family": "Inconsolata, monospace" },
  { "font-family": "Source Code Pro, monospace" },
  { "font-family": "PT Mono, monospace" },
  { "font-family": "Ubuntu Mono, monospace" },
  { "font-family": "Space Mono, monospace" },
  { "font-family": "Cousine, monospace" },
  { "font-family": "VT323, monospace" },
  { "font-family": "Anonymous Pro, monospace" },
  { "font-family": "Nanum Gothic Coding, monospace" },
  { "font-family": "Fira Mono, monospace" },
  { "font-family": "Share Tech Mono, monospace" },
  { "font-family": "Cutive Mono, monospace" },
  { "font-family": "Oxygen Mono, monospace" },
  { "font-family": "Overpass Mono, monospace" },
  { "font-family": "IBM Plex Mono, monospace" }
];

// function displayOut() {
//   var x = document.getElementById("changeFont");
//   //fontSwitch();

//   //function fontSwitch() {
//   for (let i = 0; i < fontArray.length; i++) {
//     //$(x).css(fontArray[i]);
//     var change = $(x).css(fontArray[i]);
//     setTimeout(change);

//     //}
//   }
// }

//displayOut();

function stuffAppear() {
  var i = 0;
  for (i = 0; i < fontArray.length; i++) {
    setupRepeat(i);
  }
}

function setupRepeat(i) {
  apperance(i);
  function apperance(i) {
    var x = document.getElementById("changeFont");
    setTimeout(function() {
      $(x).css(fontArray[i]);
      if (i === fontArray.length - 1) {
        //console.log("repeat");
        repeatIt();
      }
    }, 0 + i * 100);
  }
}

stuffAppear();

function repeatIt() {
  stuffAppear();
}

var x = document.getElementById("changeFont");
