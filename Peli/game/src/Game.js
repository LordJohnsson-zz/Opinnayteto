Bubble.Game = function(game){};
Bubble.Game.prototype = {
	create: function(){
		// define game variables here
		this.setVariables();
		this._defaultSetup = Setup.bringDefault(this);
		this._villeSetup = Setup.bringVille()
		this._setup = this._villeSetup || this._defaultSetup;
		// set world boundary
		this.world.setBounds(0, 0, 600, 600);

		// start the physics engine
		this.physics.startSystem(Phaser.Physics.P2JS);
    	this.physics.p2.restitution = 0.25;
    	// set the collision of the wolrd boundary, top collision is set to false for bubbles to drop down
    	this.physics.p2.setBoundsToWorld(true,true,false,true,false);
    	// set gravity for the world
		this.physics.p2.gravity.y = 75;

		// create array from backgrounds, randomly pick one & display it
		var background = ['BG1','BG2','BG3','BG4','BG5','BG6'];
		bgType = this.rnd.integerInRange(0, 5);
		this.add.sprite(0, 0, background[bgType]);
		this._floor = this.add.sprite(0,600, 'FloorBox');

		// create the player, add player animation & play the animation
		this._playerHp = this._setup.playerHP;
		this._villeArray = new Array();
		for (var i = 0; i < this._playerHp; i++) {
			if (i==0) {
				this._villeArray.push(this.add.sprite(Bubble.GAME_WIDTH-36, 0, 'ville_hp'));
			}
			else{
				this._villeArray.push(this.add.sprite((this._villeArray[i-1].x-42), 0, 'ville_hp'));
			}	
		};
		this._ville = this.add.sprite(25, 620, 'ville-idle');
		this._ville.scale.set(0.8);
		this._ville.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11], 10, true);
		this._ville.animations.play('idle');

		// set font style
		this._fontStyle = SetFontStyleNormal();
		
		// initialize the spawn timer
		this._spawnBubbleTimer = 0;
		// add score image & initialize the score text
		this.add.sprite(0, 0, 'scoreStar');
		Bubble._scoreText = this.add.text(84, 29.5, "0", this._fontStyle)
		// initialize game sound
		this._appearSound = this.game.add.audio('bubble_appear');
		this._buttonSoundClick = this.game.add.audio('buttonClick');
		this._gameOverSound = this.game.add.audio('gameOver');
		this._counterSound = this.game.add.audio('counter');
		this._mainMusic = this.game.add.audio('bubbleMain');
		this._getStar = this.game.add.audio('getStar');
		this._winGame = this.game.add.audio('winGame');
		this._wrongAnswer = this.game.add.audio('wrongAnswer');

		// create new array for bubbles and x -spawning point
		this._bubbleArray = new Array();
		// create array for collecting correct answers
		this._successArray = new Array();

		// get the first expression
		this._currentExp = this._setup.arrayOfExpressions[this.rnd.integerInRange(0, this._setup.arrayOfExpressions.length-1)];
		this.showExpression(this._currentExp, this._setup.hideNumber, this);

		// get the color of the bubbles according to joinOperator
        if (this._setup.joinOperator == "addition") {
     		this._bubbleColor = "bubblesGreen";
     		this._createBubbleColor = "createGreen";
		}
		else if (this._setup.joinOperator == "subtraction") {
			this._bubbleColor = "bubblesRed";
			this._createBubbleColor = "createRed";
		}
		else if (this._setup.joinOperator == "multiply") {
			this._bubbleColor = "bubblesBlue";
			this._createBubbleColor = "createBlue";
		}
		else if (this._setup.joinOperator == "divide") {
			this._bubbleColor = "bubblesViolet";
			this._createBubbleColor = "createViolet";
		}
		// display operator for joining bubbles
		this.showJoinOperator(this._setup);

		// spawn first 5 bubbles with spawn call
		for (var i = 0; i < 5; i++) {
			Bubble.item.spawnBubble(this, this._bubbleSpawnX[this.game.rnd.integerInRange(0, 5)], this._currentExp, this._setup,false);
		};

		// add in-game menu panels
		this.pausePanel = new PausePanel(this.game);
		this.add.existing(this.pausePanel);
		this.endPanel = new GameOverPanel(this.game);
		this.add.existing(this.endPanel);
		this.winPanel = new GameWonPanel(this.game);
		this.add.existing(this.winPanel);
		this.settings = new SettingsPanel(this.game);
		this.add.existing(this.settings);

		// pause game -button
		this.btnPause = this.add.button(Bubble.GAME_WIDTH-125, Bubble.GAME_HEIGHT-150, 'button-pause', this.pauseGame, this, 0,0,1);
		// resume game -button
		this.btnPlay = this.add.button(Bubble.GAME_WIDTH-125, Bubble.GAME_HEIGHT-150, 'button-continue', function(){
			// add sound effect to onClick
			this._buttonSoundClick.play();
			// return to play the current game
			this.playGame();
		}, this,0,0,1);

		// display setup button when pause on
		this.btnSetup = this.game.add.button(Bubble.GAME_WIDTH/2-37, Bubble.GAME_HEIGHT-140, 'button-setup', function(){
			// add sound effect to onClick
			this._buttonSoundClick.play();
			// show settings menu
			if (!this._showSetup){
				this.settings.show();
				this._showSetup = true;
			}
			else{
				this.settings.hide();
				this._showSetup = false;

			}
		}, this,0,0,1)

		this.endPanel.hide();
		this.winPanel.hide();

		this._mainMusic.play("",0,1,true,false);
		this.playGame();
		
	},
	// set variables
	setVariables: function(){
		// define variables for Bubble.Game
		this._spawnBubbleTimer = 0;
		this._expressionTimer = 0;
		this._start = true;
		this._counter = 5;
		this._counterText = "";
		this._fontStyle = null;
		this._bubbleArray = 0;
		this._bubbleSpawnX = [0,100,200,300,400,500];
		this._paused = true;
		this.btnPause = null;
		this.btnPlay = null;
		this._createBubble = null;
		this._showSetup = false;
		// define game setup & expression variables
		this._ville = null;
		this._setup = null;
		this._currentExp = null;
		this._expSolved = true;
		this._txtExpression = null;
		this._answerNum = null;
		this._joinSetip = 0;
		this._playerHp = 0;
		this._tempCalculationText = "";
		this._successArray = 0;
		this._tempBubble = null;
		this._incorrect = null;
		this._correct = null;
		// define Bubble variables to reuse them in Bubble.item functions
		Bubble._scoreText = null;
		Bubble._score = 0;
	},
	update: function(){
		// check that game is not paused
		if (!this._paused){

			// update timer every frame
			this._spawnBubbleTimer += this.time.elapsed;
			// function for game start counter
			this.startCounter(this);
			// main game function
			if (!this._start){

				if (this._bubbleArray.length >= 5) {};

				// if spawn timer reach time given from setup (1 sec = 1000 milliseconds)
				if(this._spawnBubbleTimer > (this._setup.dropTime*1000)) {
					// if game screen has reached it's limits
					if (this._bubbleArray.length > 36) {
						this.gameOver();
					}
					else{
						// reset it
						this._spawnBubbleTimer = 0;
						// play spawning for bubble
						//this.createBubbles(this);
						Bubble.item.spawnBubble(this, this._bubbleSpawnX[this.game.rnd.integerInRange(0, 5)], this._currentExp, this._setup,false);
					}
				}
				// add events to bubble
				for (var i = 0; i < this._bubbleArray.length; i++) {
						// create dragable sprite from the bubble
						this._bubbleArray[i].events.onInputDown.add(this.mouseClick, this);
						// check that bubble is inside game
						//this._bubbleArray[i].events.onOutOfBounds.add(this.gameOver, this);
				}
				if (this._createBubble!=null) {
					if (!this._createBubble.alive) {
						this._createBubble.destroy();
						// call the spawner for bubbles
						Bubble.item.spawnBubble(this, this._createBubbleX, this._currentExp, this._setup,false);
						this._createBubble = null;
					}
				}
				// expression is solved
				if (this._expSolved) {
					this._expressionTimer += this.time.elapsed;
					// show the right answer for certain amount of time
					if (this._expressionTimer>5000) {
						// create a new expression
						this.newExpression();
						// print out the expression
						this.showExpression(this._currentExp, this._setup.hideNumber, this);
						// reset timer
						this._expressionTimer = 0;
					}
				};
			}
			// add event to bubble text
			for (var i = 0; i < this._bubbleArray.length; i++) {
					// move text according to bubble positions
					this._bubbleArray[i].bubbleText.x = Math.floor(this._bubbleArray[i].x);
					this._bubbleArray[i].bubbleText.y = Math.floor(this._bubbleArray[i].y);
			}
			if (this._tempBubble!=null) {
				this._tempBubble.tempText.x = Math.floor(this._tempBubble.x);
				this._tempBubble.tempText.y = Math.floor(this._tempBubble.y);
			}

			// check the player health
			if (this._playerHp< 0) {
				this.gameOver();
			}
			// floating number over bubble
			if (this._tempCalculationText!="") {

				// make it rise and fade
				this._tempCalculationText.y -= 2;
				this._tempCalculationText.alpha -= 0.005;
			}
		}
	},
	// function for handling game pause
	pauseGame: function(){
		// add pause click sound effect
		this._buttonSoundClick.play();
		if (!this._paused){
			// stop the game
			this._paused = true;
			this.btnPause.visible = false;
			this.btnPlay.visible = true;
			this.btnSetup.visible = true;
			this._txtExpression.visible = false;
			if (this._counterText.visible) {
				this._counterText.visible = false;
			}
			this._mainMusic.pause();
			// show pause menu
			this.pausePanel.show();
			// hide all bubbles
			for (var i = 0; i < this._bubbleArray.length; i++) {
					this._bubbleArray[i].bubbleText.visible = false;
					this._bubbleArray[i].kill();
			};

			// stop ville's idle-animation
			this._ville.animations.stop();	
		}
	},
	playGame: function(){
		if(this._paused){
			//set game running again
			this._paused = false;
			this.btnPause.visible = true;
			this.btnPlay.visible = false;
			this.btnSetup.visible = false;
			if (this._showSetup){
				this.settings.hide();
				this.settings.infoText.visible = false;
				this._showSetup = false;
			}
			this._txtExpression.visible = true;
			if (!this._counterText.visible) {
				this._counterText.visible = true;
			}
			// hide pause menu
			this.pausePanel.hide();
			// show all bubbles
			for (var i = 0; i < this._bubbleArray.length; i++) {
					if (!this._bubbleArray[i].alive) {
						this._bubbleArray[i].revive();
						this._bubbleArray[i].bubbleText.visible = true;
					}
			};

			// return ville's idle-animation
			this._ville.animations.play('idle');
			if (this._mainMusic.paused) {
				this._mainMusic.resume();
			}
		}
	},
	// start game counter
	startCounter: function(game){

		if (game._start) {
			var startFont = SetFontStyleLarge();

			// if spawn timer reach one second (1000 milliseconds)
			if(game._spawnBubbleTimer > 1000) {
				// clear text
				if (game._counterText != ""){ 
					// erase the counter text
					game._counterText.destroy();
				};
				// reset timer
				game._spawnBubbleTimer = 0;
				// print counter text
				if (game._counter == 0) {
				 	game._counterText = game.add.text(game.world.centerX-200, game.world.centerY-50, "Anna mennä!", startFont);
				 	game._counterText.fontSize = 75;
				}
				if(game._counter > 0){
					// play counter sound 
					this._counterSound.play();
					game._counterText = game.add.text(game.world.centerX-50, game.world.centerY-50, game._counter, startFont);
				}
				// decrease counter number 
				game._counter -= 1;
				if (game._counter < -1){
					// set counter to false
					game._start = false;
					game._counterText.destroy();
				}
			}
		}
	},
	// create new bubble to the world
	createBubbles: function(game){
		// play spwaning animation at the beginning of the bubble creation
		this._createBubbleX = this._bubbleSpawnX[game.rnd.integerInRange(0, 5)];
		this._createBubble = this.add.sprite(this._createBubbleX, 0, this._createBubbleColor);
		this._createBubble.animations.add('create');
		this._createBubble.animations.play('create',5,false,true);
	},
	// print out the current expression to be solved
	showExpression: function(sObject, hiddenNumber, game){
			var style = SetFontStyleExpression();
			var txt = "";
			var hidNum = 0;
			// randomize what number to hide
			if (hiddenNumber==1) {
				hidNum = game.rnd.integerInRange(0, 2);
			}
			else if (hiddenNumber==2) {
				hidNum = sObject.expArray.length-1;
			}
			else if (hiddenNumber==3) {
				hidNum = game.rnd.integerInRange(0, sObject.expArray.length-1);
			} 
			// loop and print expression numbers and operators
			for (var i = 0; i < sObject.expArray.length; i++) {
				// if random number and array index matches
				if (i==hidNum) {
					// if index is same as operator
					if (sObject.expArray[i] == "+" || sObject.expArray[i] == "-" || sObject.expArray[i] == "*" 
						|| sObject.expArray[i] == "/" || sObject.expArray[i] == "="){
							// print operator
							txt += sObject.expArray[i]
							// add next number to be hidden
							hidNum += 1;
							// add spacing if nessasary
							if (i!=sObject.expArray.length-1) {
								txt += " ";
							}
					}
					// if not, add answer to variable and hide number from expression 
					else{
						this._answerNum = sObject.expArray[i];
						txt += "? ";
					}
				}
				// print number out normally
				else{
					txt += sObject.expArray[i];
					if (i!=sObject.expArray.length-1) {
						txt += " ";
					}
				}
				
			};
			// finally, print out whole expression wit hidden number
			this._txtExpression = game.add.text(170, 675, txt, style);
			this._expSolved = false;
	},
	// show new expression
	newExpression: function(){
		// create new expression
		var index = this._setup.arrayOfExpressions.indexOf(this._currentExp);
		this._setup.arrayOfExpressions.splice(index, 1);
		if (this._setup.arrayOfExpressions.length<1) {
			if (Bubble._score==10) {
				this.gameWon();
			}
			else{
				this.gameOver();
			}
		}
		else{
			this._txtExpression.destroy();
			this._currentExp = null;
			this._currentExp = this._setup.arrayOfExpressions[this.rnd.integerInRange(0, this._setup.arrayOfExpressions.length-1)];
			this._expSolved = true;
		}
	},
	// check if the answer is correct
	checkAnswer: function(sObject, bubble, game){
		// if text in bubble and hidden number matches
		if (bubble.bubbleText.text == this._answerNum) {
			// give player a score, show it and play a sound
			Bubble._score += 1;
			Bubble._scoreText.text = Bubble._score;
			this._getStar.play();
			// show the whole expression
			var style = SetFontStyleExpression();
			this._txtExpression.text = sObject.expression;
			this._successArray.push(this._txtExpression.text);
			this._expSolved = true;
			// create sprite to show during correct answer
			this._correct = this.add.sprite(Bubble.GAME_WIDTH/2-96,Bubble.GAME_HEIGHT/2-228,'correct');
			this._correct.scale.set(1.5);
			this._correct.animations.add('showCorrect', [0,1,2,3,4,5,6,7], 10, false);
			this._correct.animations.play('showCorrect',null,false,true);
			return true;
		}
		// answer incorrect: play sound
		else{
			// play sound
			this._wrongAnswer.play();
			// take life away from the player
			this._playerHp -= 1;
			// show taken life as transparent to player
			this._villeArray[this._playerHp].alpha -= 0.5;
			// create sprite to show during incorrect answer
			this._incorrect = this.add.sprite(Bubble.GAME_WIDTH/2-96,Bubble.GAME_HEIGHT/2-228,'incorrect');
			this._incorrect.scale.set(1.5);
			this._incorrect.animations.add('showIncorrect', [0,1,2,3,4,5,6,7], 10, false);
			this._incorrect.animations.play('showIncorrect',null,false,true);

			return false;
		}
	},
	// to end game
	gameOver: function(){
		// stop the main music
		this._mainMusic.stop();
		// play game over sound
		this._gameOverSound.play();
		// when game over, pause game
		this._paused = true;
		// hide extra buttons and text
		this.btnPause.visible = false;
		this.btnSetup.visible = false;
		this._txtExpression.visible = false;
		this._currentExp = null;
		// show game over panel
		this.endPanel.show();
		// hide all bubbles
		for (var i = 0; i < this._bubbleArray.length; i++) {
			if (this._bubbleArray[i] != null) {
				this._bubbleArray[i].bubbleText.visible = false;
				this._bubbleArray[i].kill();
			}
		};
		// stop ville's idle-animation
		this._ville.animations.stop();
	},
	// to win game
	gameWon: function(){
		// stop the main music
		this._mainMusic.stop();
		// play game over sound
		this._winGame.play();
		// when game over, pause game
		this._paused = true;
		// hide extra buttons and text
		this.btnPause.visible = false;
		this.btnSetup.visible = false;
		this._txtExpression.visible = false;
		this._currentExp = null;
		// show game over panel
		this.winPanel.show();
		// hide all bubbles
		for (var i = 0; i < this._bubbleArray.length; i++) {
			if (this._bubbleArray[i] != null) {
				this._bubbleArray[i].bubbleText.visible = false;
				this._bubbleArray[i].kill();
			}
		};
		// stop ville's idle-animation
		this._ville.animations.stop();
	},
	// thinkgs to do when bubble is clicked with mouse
	mouseClick: function(bubble){
		// collect x and y from bubble
		var bubbleX = bubble.x;
		var bubbleY = bubble.y;
		var font = SetFontStyleBubble();
		// make clicked bubble disappear;
		bubble.kill();
		bubble.bubbleText.visible = false;
		// create temporary bubble as a "ghost" of the real one
		this._tempBubble = this.game.add.sprite(bubbleX, bubbleY, this._bubbleColor, 0);
		this._tempBubble.alpha = 0.5;
		this._tempBubble.scale.set(0.8);
		this._tempBubble.anchor.setTo(0.5);
		this._tempBubble.tempText = this.game.add.text(this._tempBubble.x, this._tempBubble.y, bubble.bubbleText.text, font);
		this._tempBubble.tempText.anchor.set(0.5);
		// Enable input detection for dragging
		this._tempBubble.inputEnabled = true;
		// Make this bubble draggable.
		this._tempBubble.input.enableDrag(true);

		this.game.time.events.add(150, function() {
			// check if mouse is still pressed down
			if (this.game.input.activePointer.isDown) {
					// makes temporary bubble moveable
					this._tempBubble.input.startDrag(this.game.input.activePointer);
			}
			// if just a click
			else{
				// do not allow splitting 0
				if (parseInt(bubble.bubbleText.text)>0) {
					// spawn the splitted bubbles
					Bubble.item.spawnBubble(this, this._bubbleSpawnX[this.game.rnd.integerInRange(0, 2)], this._currentExp, this._setup, true, bubble.bubbleText.text);
					Bubble.item.spawnBubble(this, this._bubbleSpawnX[this.game.rnd.integerInRange(2, 5)],this._currentExp, this._setup, true, bubble.bubbleText.text);
					var index = this._bubbleArray.indexOf(bubble);
					this._bubbleArray.splice(index, 1);
					this._tempBubble.tempText.destroy();
					this._tempBubble.destroy();
					bubble.bubbleText.destroy();
					bubble.destroy();
				}
				else{
					bubble.reset(bubbleX,bubbleY);
					bubble.bubbleText.visible = true;
					this._tempBubble.destroy();
				}
			}
		}, this);
		// create variable for overalpping bubble
		var overlapBubbleIndex;
		this._tempBubble.events.onDragStop.add(function(){
			// when giving an answer
			if (this._tempBubble.overlap(this._floor)) {
				// able to give answers only when expression is not solved
				if (!this._expSolved) {
					// if the answer is true
					if (this.checkAnswer(this._currentExp, bubble, this.game)) {
						// get index of the dragged bubble from the bubble array
						var index = this._bubbleArray.indexOf(bubble);
						// remove it from the array
						this._bubbleArray.splice(index, 1);
						// basic destructions for removed bubble body and temporary bubble
						bubble.bubbleText.destroy();
						bubble.destroy();
						this._tempBubble.tempText.destroy();
						this._tempBubble.destroy();
					}
					else{
						bubble.reset(bubbleX,bubbleY);
						bubble.bubbleText.visible = true;
						this._tempBubble.tempText.destroy();
						this._tempBubble.destroy();
					}
				}
				else{
					bubble.reset(bubbleX,bubbleY);
					bubble.bubbleText.visible = true;
					this._tempBubble.tempText.destroy();
					this._tempBubble.destroy();
				}
			}
			else{
				var check = false;
				
				var center;
				var oldCenter = 0;
				// get index of the dragger bubble
				var index = this._bubbleArray.indexOf(bubble);
				// loop through all the bubbles in the world
				for (var i = 0; i < this._bubbleArray.length; i++) {
					if (i !== index) {
						// check the mousepointers location against bubbles in the world when released
						if (this._tempBubble.overlap(this._bubbleArray[i])){
							// calculate distance between two object	
							center = Phaser.Point.distance(this._tempBubble, this._bubbleArray[i]);
							// get the overlapped bubble which is closest to the temporary bubble
							if(oldCenter==0){
								oldCenter = center;
								overlapBubbleIndex = i;
							}
							else if (center<oldCenter) {
								oldCenter = center;
								overlapBubbleIndex = i;
							}
							check = true;
						}
					}
				};

				// if no hoovered bubbles founded, release base bubble and remove temporary
				if (check) {
					if (this._tempCalculationText!="") {
						this._tempCalculationText.destroy();
					}
					// create a string from exeption of overlapping bubbles
					var newNum = "";
					// check the operator used in joining bubble
					if (this._setup.joinOperator=="divide") {
						// check that number to join into is divideable with joining number
						if((parseInt(this._bubbleArray[overlapBubbleIndex].bubbleText.text)%parseInt(bubble.bubbleText.text))==0){
							// if true, create new number accoriding to expression
					 		newNum = math.eval(this._bubbleArray[overlapBubbleIndex].bubbleText.text + this.bubbleJoin(this._setup) + bubble.bubbleText.text);
							// prevent too large numbers
							if (newNum<1000 && newNum> -1000) {
								// set the new number to the correct bubble
								this._bubbleArray[overlapBubbleIndex].bubbleText.text = newNum;
								// set font style fro floating expression
								var font = SetFontStyleBubble();
								// print out floating expression of joining bubbles
								this._tempCalculationText = this.game.add.text(this._bubbleArray[overlapBubbleIndex].x, this._bubbleArray[overlapBubbleIndex].y, newNum, font);
								
								// check if index is there and shorten the array by destroying the object
								if (index > -1) {
									this._bubbleArray.splice(index, 1);
									bubble.bubbleText.destroy();
									bubble.destroy();		
								}
								// destroy the temporary bubble from the game
								this._tempBubble.tempText.destroy();
								this._tempBubble.destroy();
							}
							else{
								// if number too large, reset bubble
								bubble.reset(bubbleX,bubbleY);
								bubble.bubbleText.visible = true;
								this._tempBubble.tempText.destroy();
								this._tempBubble.destroy();
							}
					 	}
					 	else{
					 		// if false, reset bubble
							bubble.reset(bubbleX,bubbleY);
							bubble.bubbleText.visible = true;
							this._tempBubble.tempText.destroy();
							this._tempBubble.destroy();
						}
					}
					else{
						// if other join operator selected
						newNum = math.eval(this._bubbleArray[overlapBubbleIndex].bubbleText.text + this.bubbleJoin(this._setup) + bubble.bubbleText.text);
						// check if negative numbers are allowed
						if (this._setup.allowNegatives) {
							// if true, check number limit
							if (newNum<1000 && newNum> -1000) {
								// set new number to the bubble
								this._bubbleArray[overlapBubbleIndex].bubbleText.text = newNum;
								// set font style fro floating expression
								var font = SetFontStyleBubble();
								// print out floating expression of joining bubbles
								this._tempCalculationText = this.game.add.text(this._bubbleArray[overlapBubbleIndex].x, this._bubbleArray[overlapBubbleIndex].y, newNum, font);
								
								// check if index is there and shorten the array by destroying the object
								if (index > -1) {
									this._bubbleArray.splice(index, 1);
									bubble.bubbleText.destroy();
									bubble.destroy();		
								}
								// destroy the temporary bubble from the game
								this._tempBubble.tempText.destroy();
								this._tempBubble.destroy();
							}
							else{
								//if number too large, reset bubble
								bubble.reset(bubbleX,bubbleY);
								bubble.bubbleText.visible = true;
								this._tempBubble.tempText.destroy();
								this._tempBubble.destroy();
							}
						}
						else{
							// if negatives not allowed, check limits once again
							if (newNum<1000 && newNum>= 0) {
								// set the new number to the bubble
								this._bubbleArray[overlapBubbleIndex].bubbleText.text = newNum;
								// set font style fro floating expression
								font = SetFontStyleBubble();
								// print out floating expression of joining bubbles
								this._tempCalculationText = this.game.add.text(this._bubbleArray[overlapBubbleIndex].x, this._bubbleArray[overlapBubbleIndex].y, newNum, font);
								
								// check if index is there and shorten the array by destroying the object
								if (index > -1) {
									this._bubbleArray.splice(index, 1);
									bubble.bubbleText.destroy();
									bubble.destroy();		
								}
								// destroy the temporary bubble from the game
								this._tempBubble.tempText.destroy();
								this._tempBubble.destroy();
							}
							else{
								//if number too large, reset bubble
								bubble.reset(bubbleX,bubbleY);
								bubble.bubbleText.visible = true;
								this._tempBubble.tempText.destroy();
								this._tempBubble.destroy();
							}
						}
					}
				}
				else{
					// otherwise, reset bubble
					bubble.reset(bubbleX,bubbleY);
					bubble.bubbleText.visible = true;
					this._tempBubble.tempText.destroy();
					this._tempBubble.destroy();
				}
			}
		}, this);
	},
	// return operator as string used in joining bubbles according to the setup
	bubbleJoin: function(setup){
		if (setup.joinOperator=="addition") {
			return "+";
		}
		else if (setup.joinOperator=="subtraction") {
			return "-";
		}
		else if (setup.joinOperator=="multiply") {
		 	return "*";
		}
		else if (setup.joinOperator=="divide") {
		 	return "/";
		}
		else{
			return "+";
		}
	},
	// show what operator is used when joining bubbles
	showJoinOperator: function(setup){
		if (setup.joinOperator=="addition") {
			this._operatorSprite = this.add.sprite(Bubble.GAME_WIDTH/2-37, 5, 'plus');
			this._operatorSprite.scale.set(0.75);
		}
		else if (setup.joinOperator=="subtraction") {
			this._operatorSprite = this.add.sprite(Bubble.GAME_WIDTH/2-37, 5, 'minus');
			this._operatorSprite.scale.set(0.75);
		}
		else if (setup.joinOperator=="multiply") {
			this._operatorSprite = this.add.sprite(Bubble.GAME_WIDTH/2-37, 5, 'multy');
			this._operatorSprite.scale.set(0.75);
		}
		else if (setup.joinOperator=="divide") {
			this._operatorSprite = this.add.sprite(Bubble.GAME_WIDTH/2-37, 5, 'divide');
			this._operatorSprite.scale.set(0.75);
		}
	}

};
Bubble.item = {
	// Spawn single bubble with text to the world
	spawnBubble: function(game, x, sObject, setup, split, bubbleNum) {
			/*-----------------------------BUBBLE CREATION------------------------------*/
			// random generate bubble type
			var bubbleType = null;
			bubbleType = game.rnd.integerInRange(0, 2)
			//spawn new bubble
			bubble = game.add.sprite(x, -50, game._bubbleColor);
			// add new animation frame & play it according to the bubble type
			bubble.animations.add('anim', [bubbleType], 10, true);
			bubble.animations.play('anim');

			// enable bubble body for physic engine
			game.physics.p2.enable(bubble, false);
			bubble.checkWorldBounds = false;
			// create circular collision and
			bubble.body.setCircle(50);
			// some rotation between 1 - 50 pixels
			bubble.body.rotateLeft(game.rnd.integerInRange(1, 50));
			// add input to bubble
			bubble.inputEnabled = true;
			/*-----------------------------TEXT CREATION------------------------------*/
			// randomize some number according to operator used in joining bubbles: '+','-','*','/'
			var number = 0;
			var style = SetFontStyleBubble();
			// check for divided number
			if (split) {
				number = math.round(math.eval(bubbleNum+"/2"),0);
			}
			else{
				// normal number generation
				number = this.generateNumber(setup, game);
			}

			bubble.bubbleText = game.add.text(bubble.x, bubble.y, number, style);
			if (bubble.bubbleText.text == " ") {
				bubble.bubbleText.text = "0";
			}
			bubble.bubbleText.anchor.set(0.5);
			// add object to an array
			game._bubbleArray.push(bubble);
			//play appearing sound
			game._appearSound.play();
	},
	// generate and return random number for bubble according
	// to the join operator given in setup
	generateNumber: function(setup, game){
		var number;
		// during addition
		if (setup.joinOperator=="addition") {
			// generate random number between 1 and one lesser than answer and return it
			number = game.rnd.integerInRange(1, game._answerNum-1);
			return number;
		}
		// during subtraction
		else if (setup.joinOperator=="subtraction") {
			// generate random number where smallest is half of the number and largest is double the number
			number = game.rnd.integerInRange((game._answerNum/2), (game._answerNum*2));
			// prevent generating the answer number
			if (number == game._answerNum) {
				number -= 1;
			}
			//return the number
			return number;
		}
		// during multiply
		else if (setup.joinOperator=="multiply") {
			// generate random number between 1 and 12 and return it
			number = game.rnd.integerInRange(0, 12);
			return number;
		}
		// during divide
		else if (setup.joinOperator=="divide") {
			// generate random number between numbers in the array
			if (typeof game.divideArray != "undefined") {
				if (game.divideArray.length<20) {
					// every other is small numbr
					if((game.divideArray.length%2) == 0){
						game.divideArray.push(game.rnd.integerInRange(2,12))
					}
					// every other is large number
					else{
						game.divideArray.push(game._answerNum*game.rnd.integerInRange(2,12))
					}
				}
				else{
					game.divideArray = [];
					game.divideArray.push(game.rnd.integerInRange(2,12))
				}
			}
			else{
				// array limitation exceeded, generate new one
				game.divideArray = [];
				game.divideArray.push(game.rnd.integerInRange(2,12))
			}
			// finally set the number randomly from array and return it
			number = game.divideArray[game.rnd.integerInRange(0,game.divideArray.length-1)];
			return number;
		}
		// if command unknown, use addition as default 
		else{
			// generate random number between 1 and one lesser than answer and return it
			number = game.rnd.integerInRange(1, game._answerNum-1);
			return number;
		}
	}
};

