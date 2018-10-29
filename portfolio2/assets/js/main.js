$('.ex span').css('opacity', '1');
var text = 'What can I code for you';
var wordsArray = text.split(' ');

for (var i = 0; i < wordsArray.length - 1; i++) {
  $('.ex').append('<span>' + wordsArray[i] + ' </span>');
}

$('.ex').append('<span>' + wordsArray[wordsArray.length - 1] + '</span>');
$('.ex').append('<span>?</span>');

$('#svgImages').append(
  '<embed id="fullWebApp" type="image/svg+xml" src="./assets/images/svg/optimization.svg" width="100%" />'
);

$(document).ready(function() {
  $('#all-content').show();
  $('#intro').hide();

  $('#workShown').hide();
  $('#blogShown').hide();
  $('#storyShown').hide();

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
  });
  $('#workNav').click(function() {
    $('#pageTop').hide();
    $('#storyShown').hide();
    $('#blogShown').hide();
    $('.smallergithub').hide();
    $('#workShown').show();
    $('.smallergithubBottom').show();
    if (window.matchMedia('(max-width: 1026px)').matches) {
      $('.hideFullscreen').show();

      var docHeight = $(document).height();

      var bottom = $('.smallergithubBottom').position().top;
      if (docHeight > bottom) {
        console.log(bottom);
      } else {
        $(function() {
          $(window)
            .scroll(function() {
              var $myDiv = $('.video-overlay');
              var st = $(this).scrollTop();
              $myDiv.height(st + docHeight);
            })
            .scroll();
        });
      }
      $('.video-overlay').css('height', `${bottom}px`);
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
