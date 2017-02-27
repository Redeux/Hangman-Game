// Game Rules
//
// If the user guesses a letter correctly all underscores for the matching letter are replaced with the letter 
// If the user guesses incorrectly that letter is shown in another area and the guess counter is decremented 
// User has 10 incorrect guesses before they lose
// User cannot guess the same letter twice and cannot guess any non-alpha characters
//
// Game Logic
//
// At startup - new game is initialized
// Computer generates a Led Zeppelin song name from the array of songs
// Computer displays an underscore for each letter in the song.  Spaces are shown and cannot be guessed
// Game listens for user key press
// Game checks user key press according to rules
// If user guesses correct show album art and play song clip, initialize new game
// If user is out of guesses play losing sound, initialize new game
// Each song can only be guessed correctly once, if user guesses all 10 correctly they win the game, do something special

// Declare Variables and Arrays
var zeppelinSongs = [
	{
		song: "Stairway to Heaven",
		album: "Led Zeppelin IV",
		art: "assets/images/Led_Zeppelin_IV.jpg",
		music: "assets/sounds/Stairway_to_Heaven_3_sections.ogg"
	},
	{
		song: "Kashmir",
		album: "Physical Graffiti",
		art: "assets/images/Physical_Graffiti.jpg",
		music: "assets/sounds/Kashmir.ogg"
	},
	{
		song: "Whole Lotta Love",
		album: "Led Zeppelin II",
		art: "assets/images/Led_Zeppelin_II.jpg",
		music: "assets/sounds/Whole_Lotta_Love.ogg"
	},
	{
		song: "Achilles Last Stand",
		album: "Presence",
		art: "assets/images/Presence.jpg",
		music: "assets/sounds/Achilles_Last_Stand.ogg"
	},
	{
		song: "When the Levee Breaks",
		album: "Led Zeppelin IV",
		art: "assets/images/Led_Zeppelin_IV.jpg",
		music: "assets/sounds/When_the_Levee_Breaks.ogg"
	},
	{
		song: "Black Dog",
		album: "Led Zeppelin IV",
		art: "assets/images/Led_Zeppelin_IV.jpg",
		music: "assets/sounds/Black_Dog.ogg"
	},
	{
		song: "Immigrant Song",
		album: "Led Zeppelin III",
		art: "assets/images/Led_Zeppelin_III.png",
		music: "assets/sounds/Immigrant_Song.ogg"
	},
	{
		song: "Dazed and Confused",
		album: "Led Zeppelin",
		art: "assets/images/Led_Zeppelin.png",
		music: "assets/sounds/Dazed_and_Confused.ogg"
	},
	{
		song: "Since I\'ve Been Loving You",
		album: "Led Zeppelin III",
		art: "assets/images/Led_Zeppelin_III.png",
		music: "assets/sounds/Since_Ive_Been_Loving_You.ogg"
	},
	{
		song: "No Quarter",
		album: "Houses of the Holy",
		art: "assets/images/Houses_of_the_Holy.jpg",
		music: "assets/sounds/No_Quarter.ogg"
	}
];
var hangmanWord = 0;
var blanks = [];
var incorrectGuesses = [];
var incorrectGuessCount = 0;
var wins = 0;
var losses = 0;
var foundIndex = [];
var youLose = "assets/sounds/You_Lose.ogg";
var displaywordBlanks = document.getElementById('wordBlanks');
var displayWins = document.getElementById('wins');
var displayLosses = document.getElementById('losses');
var displayIncorrectGuesses = document.getElementById('incorrectGuesses');
var displayGuessesLeft = document.getElementById('guessesLeft');
var displayAudioImage = document.getElementById('audioImage');
var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');



// Declare Game Object
var hangman = {
	newGame: function() {
		// Reset game specific variables
		blanks = [];
		hangmanWord = 0;
		incorrectGuesses = [];
		incorrectGuessCount = 0;
		foundIndex = [];
		displayIncorrectGuesses.textContent = "";
		displayGuessesLeft.textContent = "10";
		
		// Pick and random song from the array
		hangmanWord = zeppelinSongs[Math.floor(Math.random() * zeppelinSongs.length)];
		
		// add a blank, space, or ' as appropriate based on the song name 
		for (var i = 0; i < hangmanWord.song.length; i++) {
			if (hangmanWord.song[i] === " ") {
				blanks.push("\u00A0");
			} else if (hangmanWord.song[i] === "\'"){
				blanks.push("\'");
			} else {
				blanks.push("_");
			}
		}

		// display the blanks on the web page
		displaywordBlanks.textContent = blanks.join("\u2009");
	},
	checkGuess: function(guess) {
		if (hangmanWord.song.toLowerCase().indexOf(guess) !== -1 && incorrectGuesses.indexOf(guess) === -1 && alphabet.indexOf(guess) !== -1) {
			// if the guess is in the word and it hasn't been incorrectly guessed already and its an alpha character

			//find where in the song name it exists
			foundIndex = [];
			for (var i = 0; i < hangmanWord.song.length; i++) {
				if (hangmanWord.song[i].toLowerCase() === guess) {
					foundIndex.push(i);
				}
			}

			// replace the appropriate blank(s) with the letter
			for (var i = 0; i < foundIndex.length; i++) {	
				blanks[foundIndex[i]] = guess;
			}

			// update the display on the web page
			displaywordBlanks.textContent = blanks.join("\u2009");

		} else if (alphabet.indexOf(guess) !== -1 && hangmanWord.song.toLowerCase().indexOf(guess) === -1 && incorrectGuesses.indexOf(guess) === -1) {
			// if the guess is a letter, isn't part of the song name, and hasn't been guessed already
			
			// add it to the incorrect guess array
			incorrectGuesses.push(guess);

			// increment the incorrect guess count
			incorrectGuessCount++;

			// update the display on the web page
			displayIncorrectGuesses.textContent = incorrectGuesses.join(" ");
			displayGuessesLeft.textContent = 10 - incorrectGuessCount;
		} 
	},
	checkGameStatus: function() {
		if (incorrectGuessCount === 10) {
			// alert("You lost this round.  Better luck next time!");
			losses++;
			displayLosses.textContent = losses;
			displayAudioImage.innerHTML = "<audio controls src=\"" + youLose + "\" autoplay class=\"no-display\">";
			hangman.newGame();
		} else if (blanks.indexOf("_") === -1) {
			// alert("Winner winner chicken dinner!");
			wins++;
			displayWins.textContent = wins;
			displayAudioImage.innerHTML = "<audio controls src=\"" + hangmanWord.music + "\" autoplay class=\"no-display\">";
			hangman.newGame();
		}
	}
};

// Initialize first game
hangman.newGame();

// Main Function
document.onkeyup = function(event) {

	var userGuess = event.key;

	hangman.checkGuess(userGuess);
	hangman.checkGameStatus();

};



