var cursorBlink = '|';

let fadeDuration = 1200;

function otherMiscFunctions() {
  $('#myNavbar').fadeOut();
  setTimeout(showNavBar, 500);
  setTimeout(whatCanCode, 1000);

  hideFullFledge();
  var specificInitialValue = anime({
    targets: '#anythingFrom1',
    translateX: [-1150, 0],
    delay: 4500,
    opacity: 1,
    duration: fadeDuration,
    direction: 'alternate',
    loop: false,
    complete: function(anim) {
      //setTimeout(showFullFledge, 200);
      showFullFledge();
    }
  });
}

var showMainFade = () => {
  $('.ex span').css('opacity', '1');
};

var showNavBar = () => {
  $('#myNavbar').fadeIn();
};

var text = 'What can I code for you';
var wordsArray = text.split(' ');

console.log(wordsArray);

// console.log(text.length);
for (var i = 0; i < wordsArray.length - 1; i++) {
  $('.ex').append('<span>' + wordsArray[i] + ' </span>');
  // console.log(text[i]);
}
$('.ex').append('<span>' + wordsArray[wordsArray.length - 1] + '</span>');
$('.ex').append('<span>?</span>');

function hideFullFledge() {
  var specificInitialValue = anime({
    targets: '#anythingFrom2',
    translateX: [-1150, -1150],
    direction: 'alternate',
    loop: false
  });
}

function showFullFledge() {
  var specificInitialValue = anime({
    targets: '#anythingFrom2',
    translateX: [-1150, 0],
    duration: fadeDuration,
    opacity: 1,
    delay: 1100,
    direction: 'alternate',
    loop: false
  });
}

function showLanding() {
  var specificInitialValue = anime({
    targets: '#landingPage',
    translateX: [1150, 0],
    duration: fadeDuration,
    opacity: 1,
    delay: 100,
    direction: 'alternate',
    loop: false,
    complete: function(anim) {
      //setTimeout(showFullFledge, 200);
      showFullFledge();
    }
  });
}

function myNotesFunc() {
  $('#myNotes').show();
  $('#hello-typed').hide();
  $('#all-content').show();
}

function pageEnteredFast() {
  //$('#hello-typed').hide();
  $('#all-content').show();
  //$('#intro').hide();
  fadeoutHide();
  otherMiscFunctions();
}

function pageEnteredLong() {
  $('#all-content').show();
  var typed2 = new Typed('#typed2', {
    stringsElement: '#hello-typed',
    typeSpeed: 50,
    startDelay: 0,
    loop: false,
    cursorChar: cursorBlink,
    onComplete: function() {
      if (siteEntered < 2) {
        setTimeout(fadeoutHello, 1500);
      }
    }
  });

  document.addEventListener('keyup', function(event) {
    event.preventDefault();
    if (event.keyCode === 13 && siteEntered === 1) {
      siteEntered = 2;
      fadeoutHello();
    }
  });
}

function fadeoutHello() {
  document.getElementById('helloText').style.opacity = '0';
  setTimeout(fadeoutHide, 1000);
}

function fadeoutHide() {
  $('#intro').hide();
  //document.getElementById('helloText').style.display = 'none';
  document.getElementById('main-content').style.display = 'inherit';
  //document.getElementById('main-content').style.visibility = 'hidden';
  //showMainFade();
  //$('#intro').hide();

  setTimeout(fadeInAllContent, 100);
}

function fadeInAllContent() {
  showMainFade();
  document.getElementById('main-content').style.visibility = 'visible';
  document.getElementById('main-content').style.opacity = '1';
  otherMiscFunctions();

  //coolText();
  //otherMiscFunctions();
  siteEntered = 3;

  //showMainFade().then(otherMiscFunctions());
}

var introWatched = 0;

function userTimedEnter() {
  introWatched = 1;
}

setTimeout(userTimedEnter, 4000);

///////////////////////////////////////////////////////////////////

$(document).ready(function() {
  $('#enter-site').on('click', function() {
    //myNotesFunc();
    regularPageLoad();
    function regularPageLoad() {
      if (introWatched === 0) {
        //myNotesFunc
        //pageEnteredFast
        pageEnteredFast();
      } else {
        siteEntered = 1;
        pageEnteredLong();
      }
    }
  });
});
//////////////////////////////////////////////////////////////////

function simulateClick() {
  document.getElementById('enter-site').click();
}

var siteEntered = 0;

document.addEventListener('keyup', function(event) {
  event.preventDefault();
  if (event.keyCode === 13 && siteEntered === 0) {
    siteEntered = 1;
    simulateClick();
  }

  let key = String.fromCharCode(event.keyCode);
  //console.log(event.keyCode);
  //console.log(key);
});

// $(document).on('keypress', function() {
//   let key = String.fromCharCode(event.keyCode);
//   console.log(event.keyCode);
//   console.log(key);
// });

// $(window).keyup(function(event) {
//   if (event.keyCode === 13) {
//     console.log('test');
//   }
// });

var typed = new Typed('#typed', {
  stringsElement: '#enter-typed',
  typeSpeed: 250,
  cursorChar: cursorBlink,
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
