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
