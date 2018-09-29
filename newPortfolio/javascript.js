$(document).ready(function() {
  // $('.welcome-section').hide();
  // $('#all-content').show();
  $('#myNotes').hide();

  $('#enter-site').on('click', function() {
    $('#all-content').show();
    var typed2 = new Typed('#typed2', {
      stringsElement: '#hello-typed',
      typeSpeed: 50,
      startDelay: 0,
      loop: false
    });
  });
});

var typed = new Typed('#typed', {
  stringsElement: '#enter-typed',
  typeSpeed: 250,
  startDelay: 4500
  // loop: false
});

var docHeight = $(document).height();

$(function() {
  $(window)
    .scroll(function() {
      var $myDiv = $('.video-overlay');
      var st = $(this).scrollTop();
      $myDiv.height(st + docHeight);
    })
    .scroll();
});
//

$(function() {
  var welcomeSection = $('.welcome-section'),
    enterButton = welcomeSection.find('.enter-button');

  setTimeout(function() {
    welcomeSection.removeClass('content-hidden');
  }, 800);

  enterButton.on('click', function(e) {
    e.preventDefault();
    welcomeSection.addClass('content-hidden').fadeOut();
  });
});

//////////////////////////////////////////////////////////////////
// SCROLL FADE FUNCTIONALITY START

$(function() {
  var documentEl = $(document),
    fadeElem = $('.fade-scroll');

  documentEl.on('scroll', function() {
    var currScrollPos = documentEl.scrollTop();

    fadeElem.each(function() {
      var $this = $(this),
        elemOffsetTop = $this.offset().top;
      if (currScrollPos > elemOffsetTop)
        $this.css('opacity', 1 - (currScrollPos - elemOffsetTop) / 400);
    });
  });
});

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

function fontStart() {
  cycleFonts();
  Promise.this(function() {
    cycleFonts();
  })
    .done(function() {
      console.log('yo');
    })
    .done(function() {
      console.log('k');
    });
}

fontStart();

//////////////////////////////////////////////////////////////////
// FONT SWITCHING END
