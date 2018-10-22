$(document).ready(function() {
  $('#all-content').show();
  $('#intro').hide();

  document.getElementById('main-content').style.display = 'inherit';
  document.getElementById('main-content').style.visibility = 'visible';
  document.getElementById('main-content').style.opacity = '1';

  $('#workShown').hide();
  $('#blogShown').hide();
  $('#storyShown').hide();

  $('#introNav').click(function() {
    $('#pageTop').show();
    $('#workShown').hide();
    $('#blogShown').hide();
    $('#storyShown').hide();
  });
  $('#storyNav').click(function() {
    $('#pageTop').hide();
    $('#workShown').hide();
    $('#blogShown').hide();
    $('#storyShown').show();
  });
  $('#workNav').click(function() {
    $('#pageTop').hide();
    $('#storyShown').hide();
    $('#blogShown').hide();
    $('#workShown').show();
  });
  $('#blogNav').click(function() {
    $('#pageTop').hide();
    $('#storyShown').hide();
    $('#workShown').hide();
    $('#blogShown').show();
  });
});

$('.ex span').css('opacity', '1');
var text = 'What can I code for you';
var wordsArray = text.split(' ');

for (var i = 0; i < wordsArray.length - 1; i++) {
  $('.ex').append('<span>' + wordsArray[i] + ' </span>');
}

$('.ex').append('<span>' + wordsArray[wordsArray.length - 1] + '</span>');
$('.ex').append('<span>?</span>');

secondSVG();
function secondSVG() {
  $('#svgImages').append(
    '<embed id="fullWebApp" type="image/svg+xml" src="./assets/images/svg/optimization.svg" width="100%" />'
  );
}
