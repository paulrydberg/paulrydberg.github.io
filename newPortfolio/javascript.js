var cursorBlink = '|';

var canvas = document.getElementById('canvas'),
  ctx = canvas.getContext('2d'),
  canvas2 = document.getElementById('canvas2'),
  ctx2 = canvas2.getContext('2d'),
  // full screen dimensions
  cw = window.innerWidth,
  ch = window.innerHeight,
  charArr = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '$',
    '+',
    '-',
    '*',
    '/',
    '=',
    '%',
    '"',
    "'",
    '#',
    '&',
    '_',
    '(',
    ')',
    ',',
    '.',
    ';',
    ':',
    '?',
    '!',
    '\\',
    '|',
    '{',
    '}',
    '<',
    '>',
    '[',
    ']',
    '^',
    '~',
    '诶',
    '比',
    '西',
    '迪',
    '伊',
    '吉',
    '艾',
    '杰',
    '开',
    '哦',
    '屁',
    '提',
    '维'
  ],
  maxCharCount = 100,
  fallingCharArr = [],
  fontSize = 8,
  maxColums = cw / fontSize;
canvas.width = canvas2.width = cw;
canvas.height = canvas2.height = ch;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.draw = function(ctx) {
  this.value = charArr[randomInt(0, charArr.length - 1)].toUpperCase();
  this.speed = randomFloat(1, 5);

  ctx2.fillStyle = 'rgba(255, 255, 255, 0.242)';
  ctx2.font = fontSize + 'px san-serif';
  ctx2.fillText(this.value, this.x, this.y);

  ctx.fillStyle = 'rgba(0, 255, 0, 0.274)';
  ctx.font = fontSize + 'px san-serif';
  ctx.fillText(this.value, this.x, this.y);

  this.y += this.speed;
  if (this.y > ch) {
    this.y = randomFloat(-200, 0);
    this.speed = randomFloat(2, 5);
  }
};

for (var i = 0; i < maxColums; i++) {
  fallingCharArr.push(new Point(i * fontSize, randomFloat(-2000, 0)));
}

var update = function() {
  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  ctx.fillRect(0, 0, cw, ch);

  ctx2.clearRect(0, 0, cw, ch);

  var i = fallingCharArr.length;

  while (i--) {
    fallingCharArr[i].draw(ctx);
    var v = fallingCharArr[i];
  }

  requestAnimationFrame(update);
};

update();

function myNotesFunc() {
  $('#myNotes').show();
  $('#hello-typed').hide();
  $('#all-content').show();
}

function pageEnteredFast() {
  $('#hello-typed').hide();
  $('#all-content').show();
  fadeoutHide();
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
  document.getElementById('helloText').style.display = 'none';
  document.getElementById('main-content').style.display = 'inherit';
  document.getElementById('main-content').style.visibility = 'hidden';
  setTimeout(fadeInAllContent, 100);
}

function fadeInAllContent() {
  document.getElementById('main-content').style.visibility = 'visible';
  document.getElementById('main-content').style.opacity = '1';
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
        //myNotesFunc
        //pageEnteredFast
        pageEnteredFast();
      } else {
        pageEnteredLong();
      }
    }
  });
});
//////////////////////////////////////////////////////////////////

function simulateEnter() {
  document.getElementById('enter-site').click();
}

var siteEntered = 0;

document.addEventListener('keyup', function(event) {
  event.preventDefault();
  if (event.keyCode === 13 && siteEntered === 0) {
    siteEntered = 1;
    simulateEnter();
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
