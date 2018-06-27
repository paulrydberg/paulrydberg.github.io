$(document).ready(function() {

  var winningSound = new Audio("win.mp3");
  var losingSound = new Audio("lose.mp3");
  var backgroundMusic = new Audio("song.mp3");

  setTimeout(playSong, 1 * 1);
  function playSong() {
    backgroundMusic.play();
  }

  function winSound() {
    winningSound.play();
  }

  function loseSound() {
    losingSound.play();
  }

var matchNumberJS = 0;
var winsJS = 0;
var lossesJS = 0;
var totalScoreJS = 0;
var blueGemJS = 0;
var greenGemJS = 0;
var purpleGemJS = 0;
var redGemJS = 0;




  setTimeout(startGameAlready, 1 * 1);

  function startGameAlready() {

    $("#wins").append(winsJS);
    console.log("Wins initially set to zero. " + "Value: " + winsJS);

    $("#losses").append(lossesJS);
    console.log("Losses initially set to zero. " + "Value: " + lossesJS);

    $("#matchNumber").append(matchNumberJS);
    console.log("Number to match initially set to zero. " + "Value: " + matchNumberJS);

    $("#totalScore").append(totalScoreJS);
    console.log("Total score initially set to zero. " + "Value: " + totalScoreJS);

    

  }


matchNumberJS = Math.floor(Math.random() * 101) + 19;

var blueGemNumber = "";
var blueRandom = Math.floor(Math.random() * 12) + 1;
var greenGemNumber = "";
var greenRandom = Math.floor(Math.random() * 12) + 1;
var purpleGemNumber = "";
var purpleRandom = Math.floor(Math.random() * 12) + 1;
var redGemNumber = "";
var redRandom = Math.floor(Math.random() * 12) + 1;

  setTimeout(logNumbers, 1 * 1);

  function logNumbers() {
    console.log("The number for the blue crystal is " + blueRandom);
    console.log("The number for the green crystal is " + greenRandom);
    console.log("The number for the purple crystal is " + purpleRandom);
    console.log("The number for the red crystal is " + redRandom);
    console.log("The number to win is " + matchNumberJS);
  }

var blueGemNumberSet = blueRandom + blueGemNumber;
var greenGemNumberSet = greenRandom + greenGemNumber;
var purpleGemNumberSet = purpleRandom + purpleGemNumber;
var redGemNumberSet = redRandom + redGemNumber;

blueGemNumberSet = parseInt(blueGemNumberSet);
greenGemNumberSet = parseInt(greenGemNumberSet);
purpleGemNumberSet = parseInt(purpleGemNumberSet);
redGemNumberSet = parseInt(redGemNumberSet);

  $("#blueGem").on("click", function() {
    totalScoreJS = blueGemNumberSet + totalScoreJS
    $("#totalScore").empty();
    $("#totalScore").append(totalScoreJS);
    setTimeout(winLoseAnalysis, 1 * 1);
  });

  $("#greenGem").on("click", function() {
    totalScoreJS = greenGemNumberSet + totalScoreJS
    $("#totalScore").empty();
    $("#totalScore").append(totalScoreJS);
    setTimeout(winLoseAnalysis, 1 * 1);
  });

  $("#purpleGem").on("click", function() {
    totalScoreJS = purpleGemNumberSet + totalScoreJS
    $("#totalScore").empty();
    $("#totalScore").append(totalScoreJS);
    setTimeout(winLoseAnalysis, 1 * 1);
  });

  $("#redGem").on("click", function() {
    totalScoreJS = redGemNumberSet + totalScoreJS
    $("#totalScore").empty();
    $("#totalScore").append(totalScoreJS);
    setTimeout(winLoseAnalysis, 1 * 1);
  });



  function winLoseAnalysis() {
    if (totalScoreJS === matchNumberJS) {
      

      console.log("You Win!!! LOGGED");
      $("#result").empty();
      $("#result").append('You Win!!!');

      winsJS++;
      $("#wins").empty();
      $("#wins").append(winsJS);

      setTimeout(winSound, 1 * 1);

      setTimeout(newGame, 1 * 1);
      


    }
  
    else if (totalScoreJS > matchNumberJS) {
      

      console.log("You LOSE!!! LOGGED");
      $("#result").empty();
      $("#result").append('You LOSE!!!');
     
      lossesJS++;
      $("#losses").empty();
      $("#losses").append(lossesJS);

      setTimeout(loseSound, 1 * 1);

      setTimeout(newGame, 1 * 1);


    }

    

  }


  function newGame() {
    $("#totalScore").empty();
    totalScoreJS = 0;
    $("#totalScore").append(totalScoreJS);

    $("#matchNumber").empty();
    matchNumberJS = Math.floor(Math.random() * 101) + 19;
    $("#matchNumber").append(matchNumberJS);

    blueGemNumber = "";
    blueRandom = Math.floor(Math.random() * 12) + 1;
    greenGemNumber = "";
    greenRandom = Math.floor(Math.random() * 12) + 1;
    purpleGemNumber = "";
    purpleRandom = Math.floor(Math.random() * 12) + 1;
    redGemNumber = "";
    redRandom = Math.floor(Math.random() * 12) + 1;
    
    blueGemNumberSet = blueRandom + blueGemNumber;
    greenGemNumberSet = greenRandom + greenGemNumber;
    purpleGemNumberSet = purpleRandom + purpleGemNumber;
    redGemNumberSet = redRandom + redGemNumber;

    blueGemNumberSet = parseInt(blueGemNumberSet);
    greenGemNumberSet = parseInt(greenGemNumberSet);
    purpleGemNumberSet = parseInt(purpleGemNumberSet);
    redGemNumberSet = parseInt(redGemNumberSet);
    

    

  }

  



  


});


  // function newGame() {

  //   blueGemNumber = "";
  //   blueRandom = Math.floor(Math.random() * 12) + 1;
  //   greenGemNumber = "";
  //   greenRandom = Math.floor(Math.random() * 12) + 1;
  //   purpleGemNumber = "";
  //   purpleRandom = Math.floor(Math.random() * 12) + 1;
  //   redGemNumber = "";
  //   redRandom = Math.floor(Math.random() * 12) + 1;

  //   console.log("The number for the blue crystal is " + blueRandom);
  //   console.log("The number for the green crystal is " + greenRandom);
  //   console.log("The number for the purple crystal is " + purpleRandom);
  //   console.log("The number for the red crystal is " + redRandom);
  //   //console.log("The number to win is " + matchNumberJS);


  // }

  //-----------------------------------------------------------------------------------------------

// Pseudo Code

//set main function as start of game

// set wins zero
// append value to 'wins'

// set losses to zero
// append value to 'losses'

// create inner function to set new values 'matchNumber' and crystal 
// values at start of game maybe after super small delay
// gemnumbers = 1-12
// matchNumber = 19-120


// Create a randomly generated number at each start of game
// for the score to match
// append number to 'matchNumber'

// reset current score to zero
// append current score to 'totalScore'


// Create a randomly generated number for each crystal/gem
// do not append

// end inner values function

// create click and adding functions

// get current values from HTML

// when user clicks a crystal its value will be added to current 
// score
// when user clicks crystal add value to current score
// --> parseInt current score and crystal value
// --> add together the numbers and append


// when 'totalScoreJS' is greater than 'matchNumberJS' add 1 to loss
// when 'totalScoreJS' is equal to 'matchNumberJS' add 1 to win

// after super small delay start game over
