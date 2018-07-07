$(document).ready(function() {
    $("#gamestart").on("click", function() {
    $("#beginbox").hide();
    $("#actualGame").show();
    });
});

$(function(){
    $("#submit").click(function(){      
        var q1, q2, q3, q4, q5, grade;
        q1 = $('input[name="q1"]:radio:checked').val();
        q2 = $('input[name="q2"]:radio:checked').val();
        q3 = $('input[name="q3"]:radio:checked').val();
        q4 = $('input[name="q4"]:radio:checked').val();
        q5 = $('input[name="q5"]:radio:checked').val();

        q1 == 'true' ? q1 = 1: q1 = 0;
        q2 == 'true' ? q2 = 1: q2 = 0;
        q3 == 'true' ? q3 = 1: q3 = 0;
        q4 == 'true' ? q4 = 1: q4 = 0;
        q5 == 'true' ? q5 = 1: q5 = 0;

        wins = q1 + q2 + q3 + q4 + q5
        losses = 5 - q1 - q2 - q3 - q4 - q5
        grade = (wins / 5)*100
        
        $("#actualGame").hide();
        $("#results").show();
        $("#correct").empty();
        $("#incorrect").empty();
        $("#grade").empty();
        $("#correct").append(wins);
        $("#incorrect").append(losses);
        $("#grade").append(grade);
        
    });
    
});

var number = 90;
var intervalId;

function run() {
  clearInterval(intervalId);
  intervalId = setInterval(decrement, 1000);
}

function decrement() {
  number--;
  $("#secondsLeft").html(number);
  if (number === 0) {
    stop();
    
  }
}

function stop() {

    var q1 = $('input[name="q1"]:radio:checked').val();
    var q2 = $('input[name="q2"]:radio:checked').val();
    var q3 = $('input[name="q3"]:radio:checked').val();
    var q4 = $('input[name="q4"]:radio:checked').val();
    var q5 = $('input[name="q5"]:radio:checked').val();

    q1 == 'true' ? q1 = 1: q1 = 0;
    q2 == 'true' ? q2 = 1: q2 = 0;
    q3 == 'true' ? q3 = 1: q3 = 0;
    q4 == 'true' ? q4 = 1: q4 = 0;
    q5 == 'true' ? q5 = 1: q5 = 0;

    wins = q1 + q2 + q3 + q4 + q5
    losses = 5 - q1 - q2 - q3 - q4 - q5
    grade = (wins / 5)*100
    
    $("#actualGame").hide();
    $("#results").show();
    $("#correct").empty();
    $("#incorrect").empty();
    $("#grade").empty();
    $("#correct").append(wins);
    $("#incorrect").append(losses);
    $("#grade").append(grade);
}

run();