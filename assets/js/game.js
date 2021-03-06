// Game Rules
//
// If the user guesses a letter correctly all underscores for the matching letter are replaced with the letter 
// If the user guesses incorrectly that letter is shown in another area and the guess counter is decremented 
// User has 7 incorrect guesses before they lose
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
var zeppelinOptions = [
	{
		song: "Stairway to Heaven",
		album: "Led Zeppelin IV",
		art: "assets/images/Led_Zeppelin_IV.jpg",
		music: "assets/sounds/Stairway_to_Heaven.ogg"
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
var lastHangmanWord = {};
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
	createBlanks: function() {
		// add a blank, space, or ' as appropriate based on the song name 
		// console.log(hangmanWord);
		for (var i = 0; i < hangmanWord.song.length; i++) {
			if (hangmanWord.song[i] === " ") {
				blanks.push("\u00A0");
			} else if (hangmanWord.song[i] === "\'"){
				blanks.push("\'");
			} else {
				blanks.push("_");
			}
		}
	},
	resetVarToDefault: function(...variables) {
		// resets any number of variable to their 'empty' state based on their type
		var newArray = [];

		variables.forEach(function(item) {
			switch(typeof item) {
				case 'number':
					item = 0;
					newArray.push(item);
					break;
				case 'string':
					item = "";
					newArray.push(item);
					break;
				case 'boolean':
					item = false;
					newArray.push(item);
					break;
				case 'object':
					if (Array.isArray(item)) {
						item = [];
						newArray.push(item);
					} else {
						item = {};
						newArray.push(item);
					}
				default:
					break;
			}
		});
		return newArray;
	},
	generateRandomOption: function(toRandom) {
		// Generate a random option from the zeppelinOptions Array and make sure it doesn't match the previous one unless there is only one left
		do {
		randomOption = toRandom[Math.floor(Math.random() * toRandom.length)];
		} while (randomOption === lastHangmanWord && toRandom.length > 1) 

		return randomOption;
	},
	newGame: function() {
		// Reset game specific variables
		[blanks, hangmanWord, incorrectGuesses, incorrectGuessCount, foundIndex, displayIncorrectGuesses.textContent] = hangman.resetVarToDefault(blanks, hangmanWord, incorrectGuesses, incorrectGuessCount, foundIndex, displayIncorrectGuesses.textContent);

		displayGuessesLeft.textContent = "7";

		// Pick and random song from the array
		hangmanWord = hangman.generateRandomOption(zeppelinOptions);
		
		// Create the letter blanks for display
		hangman.createBlanks();

		// display the blanks on the web page
		hangman.updateBlanksDisplay();
	},
	checkGuess: function(guess) {
		if (hangmanWord.song.toLowerCase().indexOf(guess) !== -1 && incorrectGuesses.indexOf(guess) === -1 && alphabet.indexOf(guess) !== -1) {
			// if the guess is in the word and it hasn't been incorrectly guessed already and its an alpha character
			return true;

		} else if (alphabet.indexOf(guess) !== -1 && hangmanWord.song.toLowerCase().indexOf(guess) === -1 && incorrectGuesses.indexOf(guess) === -1) {
			// if the guess is a letter, isn't part of the song name, and hasn't been guessed already
			return false;

		} else {
			// return something not true or false so javascript doesn't assume false
			return -1;

		}
	},
	updateBlanks: function(guess) {
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
		hangman.updateBlanksDisplay();
	},
	updateIncorrectGuess: function(guess) {
		// add it to the incorrect guess array
		incorrectGuesses.push(guess);

		// increment the incorrect guess count
		incorrectGuessCount++;

		// update the display on the web page
		displayIncorrectGuesses.textContent = incorrectGuesses.join(" ");
		displayGuessesLeft.textContent = 7 - incorrectGuessCount;
	},
	updateBlanksDisplay: function() {
		displaywordBlanks.textContent = blanks.join("\u2009");
	},
	checkIfOver: function() {
		if (zeppelinOptions.length === 0) {
			// If the user has guessed all the songs
			displaywordBlanks.textContent = "You Win!  GAME OVER"
			displayAudioImage.innerHTML = "<audio controls src=\"assets/sounds/Gallows_Pole.ogg\" autoplay class=\"invisible\">";
		} else {
			// Initialize a new game
			hangman.newGame();
		}
	},
	checkGameStatus: function() {
		if (incorrectGuessCount === 7) {
			// If the incorrect guess count exceeds the maximum
			// Increment the loss count
			losses++;
			// Update the loss display
			displayLosses.textContent = losses;
			// Display the you lost text
			displayAudioImage.innerHTML = "<h4>Not quite.  Better luck next time!</h4>" + 
			"<audio controls src=\"" + youLose + "\" autoplay class=\"invisible\">";
			// Set the lastHangmanWord so it can be checked for the next game
			lastHangmanWord = hangmanWord;
			// Initialize a new game
			hangman.newGame();
		} else if (blanks.indexOf("_") === -1) {
			// If there are no more blanks in the blanks array
			// Increment the win count
			wins++;
			// Update the wins display
			displayWins.textContent = wins;
			// Display the you win text
			displayAudioImage.innerHTML = "<h4>You got it!</h4>" + 
			"<img src=\"" + hangmanWord.art + "\" class=\"d-block\">" + 
			"<audio controls src=\"" + hangmanWord.music + "\" autoplay>";
			// Remove the song as a future option
			zeppelinOptions.splice(zeppelinOptions.indexOf(hangmanWord), 1);
			// Check to see if the game is over and reset if not
			hangman.checkIfOver();
		}
	}
};

// Initialize first game
hangman.newGame();

// Main Function
document.onkeyup = function(event) {

	var userGuess = event.key;

	// Check userGuess
	if (hangman.checkGuess(userGuess)) {
		//If the user's guess is correct update the corresponding blanks
		hangman.updateBlanks(userGuess);
	} else if (!hangman.checkGuess(userGuess)) {
		//If the user's guess isn't correct update incorrect guesses and decrement the guess counter
		hangman.updateIncorrectGuess(userGuess);
	}

	// Check to see if the user has won or lost
	hangman.checkGameStatus();

};



