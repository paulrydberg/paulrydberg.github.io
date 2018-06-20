

const phrases = [
    'juice',
    'ideal',
    'haunt',
    'glory',
    'final',
    'drive',
    'crime',
    'bride',
    'agony',
    'zebra',
    'yield',
    'voice',
    'until',
    'table',
    'scent',
    'raise',
    'quart',
    'proud',
    'other',
    'north',
    'music',
    'liver',
    'knife',
    'heart',
    'grief',
    'flags',
    'elbow',
    'xrays',
    'years',
    'watch',
    'visor',

];


//Choose phrase randomly
let randomizer = Math.floor(Math.random() * phrases.length);
let phraseInput = phrases[randomizer];
let rightPhrase = [];
let wrongPhrase = [];
let underscore = [];
let correctLetters = 0;
let win = 0;
let loss = 0;

// DOM edit
let underscoreWright = document.getElementsByClassName('underscores');
let rightPhraseWright = document.getElementsByClassName('rightGuess');
let wrongPhraseWright = document.getElementsByClassName('wrongGuess');

// Testing
console.log(phraseInput);



//Create underscores based on length of word
let underscoreMaker = () => {
    for(let i = 0; i < phraseInput.length; i++) {
        underscore.push('_');
    }
    return underscore;
}


//Get users guess

document.addEventListener('keypress', (event) => {
    let letterGuess = String.fromCharCode(event.keyCode);

    if(phraseInput.indexOf(letterGuess) > -1) {

        rightPhrase.push(letterGuess);  
        
        underscore[phraseInput.indexOf(letterGuess)] = letterGuess;
        underscoreWright[0].innerHTML = underscore.join(' ');
        
        rightPhraseWright[0].innerHTML = rightPhrase;   
        
        
        if(underscore.join('') == phraseInput) {      
            
        //rightPhraseWright[0].innerHTML = rightPhrase;   
            alert('You Win');
        }
    } else {
    wrongPhrase.push(letterGuess);
    wrongPhraseWright[0].innerHTML = wrongPhrase;
    }


});



underscore[0].innerHTML = underscoreMaker().join(' ');

