var cursorBlink = '|';

$(document).ready(function() {
  $('#introNav').click(function() {
    location.reload();
  });
  $('#storyNav').click(function() {
    $('.hideFullscreen').hide();
    $('.smallergithubBottom').hide();
    $('#pageTop').hide();
    $('#workShown').hide();
    $('#blogShown').hide();
    $('.smallergithub').hide();
    $('#storyShown').show();
    $('.hideFullscreen').hide();

  });
  $('#workNav').click(function() {
    $('#pageTop').hide();
    $('#storyShown').hide();
    $('#blogShown').hide();
    $('.smallergithub').hide();
    $('#workShown').show();
    $('.smallergithubBottom').show();
    if (window.matchMedia('(max-width: 1025px)').matches) {
      $('.hideFullscreen').show();
    }
    if (window.matchMedia('(max-width: 769px)').matches) {
      $('.turtlePower').css('margin-left', '7px');
    }
  });
  $('#blogNav').click(function() {
    $('.hideFullscreen').hide();
    $('.smallergithubBottom').hide();
    $('#pageTop').hide();
    $('#storyShown').hide();
    $('#workShown').hide();
    $('.smallergithub').hide();
    $('#blogShown').show();
  });
});

let fadeDuration = 1000;

function fedLeftStart() {
  var specificInitialValue = anime({
    targets: '#anythingFrom1',
    translateX: [-1150, 0],
    delay: 5000,
    opacity: 1,
    duration: fadeDuration,
    direction: 'alternate',
    loop: false,
    complete: function(anim) {
      showFullFledge();
    }
  });
}

var showSVGfade = () => {
  $('#svgImages').css('opacity', '1');
};

var showNavBar = () => {
  $('#myNavbar')
    .fadeIn()
    .then(fedLeftStart())
    .then(showSVGfade());
};

function step1(newFunc) {
  showNavBar();
  newFunc();
}

function otherMiscFunctions() {
  showNavBar();

  hideFullFledge();
}

var showMainFade = () => {
  $('.ex span').css('opacity', '1');
};

var text = 'What can I code for you';
var wordsArray = text.split(' ');

console.log(wordsArray);

for (var i = 0; i < wordsArray.length - 1; i++) {
  $('.ex').append('<span>' + wordsArray[i] + ' </span>');
}

$('.ex').append('<span>' + wordsArray[wordsArray.length - 1] + '</span>');
$('.ex').append('<span>?</span>');

$('#svgImages').append(
  '<embed id="landingSVG" type="image/svg+xml" src="./assets/images/svg/landing-page (2).svg" width="110%" />'
);

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
    loop: false,
    complete: function(anim) {
      showImage();
    }
  });
}

function hideImage() {
  document.getElementById('svgImages').style.opacity = '0';
  setTimeout(showImage, 1000);
}

function showImage() {
  $('#landingSVG').hide();
  secondSVG();
  document.getElementById('svgImages').style.opacity = '1';
}

function secondSVG() {
  $('#svgImages').append(
    '<embed id="fullWebApp" type="image/svg+xml" src="./assets/images/svg/optimization.svg" width="100%" />'
  );
}

function hideInitial() {
  $('#landingSVG').hide();
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
      showFullFledge();
    }
  });
}

function pageEnteredFast() {
  $('#all-content').show();
  $('#myNavbar').fadeOut();
  fadeoutHide();
}

function pageEnteredLong() {
  $('#myNavbar').fadeOut();
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
  document.getElementById('main-content').style.display = 'inherit';
  setTimeout(fadeInAllContent, 100);
}

function fadeInAllContent() {
  showMainFade();

  document.getElementById('main-content').style.visibility = 'visible';
  document.getElementById('main-content').style.opacity = '1';
  otherMiscFunctions();
  siteEntered = 3;
}

var introWatched = 0;

function userTimedEnter() {
  introWatched = 1;
}

setTimeout(userTimedEnter, 4000);

///////////////////////////////////////////////////////////////////

$(document).ready(function() {
  $('#enter-site').on('click', function() {
    regularPageLoad();

    function regularPageLoad() {
      if (introWatched === 0) {
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
});

var typed = new Typed('#typed', {
  stringsElement: '#enter-typed',
  typeSpeed: 250,
  cursorChar: cursorBlink,
  startDelay: 4500
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
