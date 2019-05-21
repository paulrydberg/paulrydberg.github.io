//////////////////////////////////////////////////////////////////
// FONT SWITCHING START

var fontArray = [
  { 'font-family': 'VT323, monospace' },
  { 'font-family': 'Londrina Shadow, cursive' },
  { 'font-family': 'Fredericka the Great, cursive' },
  { 'font-family': 'Cabin Sketch, cursive' },
  { 'font-family': 'Bangers, cursive' },
  { 'font-family': 'Megrim, cursive' },
  { 'font-family': 'Barrio, cursive' },
  { 'font-family': 'Love Ya Like A Sister, cursive' }
];

var divToChange = document.getElementById('changeFont');

function cycleFonts() {
  var i;
  for (i = 0; i < fontArray.length; i++) {
    changeCSS(i);
    //restoreOpacity();
  }
}

function changeCSS(i) {
  setTimeout(function() {
    $(divToChange).css(fontArray[i]);
    //$(divToChange).addClass("showIt");
    //$(divToChange).fadeTo(2000, 0.0);
    // $(divToChange).fadeTo(0 + i * 1, 1.0);
    // setTimeout(restoreOpacity(), 1000);

    if (i === fontArray.length - 1) {
      //console.log("repeat");
      repeatIt();
    }
  }, 0 + i * 2000);
}

function repeatIt() {
  //$(divToChange).fadeTo(1, 0.9);

  cycleFonts();
}

//cycleFonts();

function restoreOpacity() {
  console.log('test');
  $(divToChange)
    .hide()
    .fadeIn(1);
}

//$.when(cycleFonts()).done(restoreOpacity());

//////////////////////////////////////////////////////////////////
// FONT SWITCHING END
