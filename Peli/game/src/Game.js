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
				this._villeArray.push(this.add.sprite(Bubble.GAME_WIDTH-32, 0, 'ville_hp'));
			}
			else{
				this._villeArray.push(this.add.sprite((this._villeArray[i-1].x-32), 0, 'ville_hp'));
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
		// add score image & initialize the score text with 0
		this.add.sprite(0, 0, 'score-bg');
		Bubble._scoreText = this.add.text(84, 29.5, "0", this._fontStyle);
		// initialize sound
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
		
		// get the first expression
		this._currentExp = this._setup.arrayOfExpressions[this.rnd.integerInRange(0, this._setup.arrayOfExpressions.length-1)];
		this.showExpression(this._currentExp, this);

		// spawn first 5 bubbles with spawn call
		for (var i = 0; i < 5; i++) {	
			Bubble.item.spawnBubble(this, this._currentExp, this._setup,null);
			// create dragable sprite from the bubble
			this._bubbleArray[i].events.onInputDown.add(this.mouseClick, this);
		};

		// add pause button
		this.btnPause = this.add.button(Bubble.GAME_WIDTH-125, Bubble.GAME_HEIGHT-150, 'button-pause', this.pauseGame, this, 0,0,1);
		// add in-game menu panels
		this.pausePanel = new PausePanel(this.game);
		this.add.existing(this.pausePanel);
		this.endPanel = new GameOverPanel(this.game);
		this.add.existing(this.endPanel);
		this.winPanel = new GameWonPanel(this.game);
		this.add.existing(this.winPanel);

		this.endPanel.hide();
		this.winPanel.hide();
		this._mainMusic.play("",0,1,true,false);
		this.playGame();
	},
	// set variables
	setVariables: function(){
		// define variables for Bubble.Game
		this._spawnBubbleTimer = 0;
		this._start = true;
		this._counter = 5;
		this._counterText = "";
		this._fontStyle = null;
		this._bubbleArray = 0;
		this._bubbleSpawnX = [0,100,200,300,400,500];
		this._paused = true;
		this.btnPause = null;
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
			this.createBubbles(this);

			// add event to bubble text
			for (var i = 0; i < this._bubbleArray.length; i++) {
				if (this._bubbleArray[i] !== null) {
					// move text according to bubble positions
					this._bubbleArray[i].bubbleText.x = Math.floor(this._bubbleArray[i].x);
					this._bubbleArray[i].bubbleText.y = Math.floor(this._bubbleArray[i].y);
			 	}
			}
			// print out the current expression
			this.showExpression(this._currentExp, this.game);
			// check the player health
			if (this._playerHp<= 0) {
				this.gameOver();
			}
			// floating number over bubble
			if (this._tempCalculationText!="") {

				// make it rise and fade
				this._tempCalculationText.y -= 10;
				this._tempCalculationText.alpha -= 0.01;
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
			this._txtExpression.visible = false;
			this._mainMusic.pause();
			// show pause menu
			this.pausePanel.show();
			// hide all bubbles
			for (var i = 0; i < this._bubbleArray.length; i++) {
				if (this._bubbleArray[i] !== null) {
					this._bubbleArray[i].bubbleText.visible = false;
					this._bubbleArray[i].kill();					
				}
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
			this._txtExpression.visible = true;
			// hide pause menu
			this.pausePanel.hide();
			// show all bubbles
			for (var i = 0; i < this._bubbleArray.length; i++) {
				if (this._bubbleArray[i] !== null) {
					if (!this._bubbleArray[i].alive) {
						this._bubbleArray[i].revive();
						this._bubbleArray[i].bubbleText.visible = true;
					}
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
	createBubbles: function(game){
		// start game itself
		if (!game._start){

			// if spawn timer reach time given from setup (1 sec = 1000 milliseconds)
			if(game._spawnBubbleTimer > (this._setup.dropTime*1000)) {
				// if game screen has reached it's limits
				if (this._bubbleArray.length > 36) {
					this.gameOver();
				}
				else{
					// reset it
					game._spawnBubbleTimer = 0;
					// call the spawner for bubbles
					Bubble.item.spawnBubble(game, this._currentExp, this._setup,null);
				}
			}
			// add events to bubble
			for (var i = 0; i < game._bubbleArray.length; i++) {
				if (game._bubbleArray[i] !== null) {
					// create dragable sprite from the bubble
					game._bubbleArray[i].events.onInputDown.add(game.mouseClick, this);
					// check that bubble is inside game
					//game._bubbleArray[i].events.onOutOfBounds.add(game.gameOver, this);
			 	}
			}
		}
	},
	// print out the current expression to be solved
	showExpression: function(sObject, game){
		// expression is solved
		if (this._expSolved) {
			var style = SetFontStyleExpression();
			var txt = "";
			// randomize what number to hide
			var hidNum = game.rnd.integerInRange(0, sObject.expArray.length-1)
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
			this._txtExpression = game.add.text(160, 685, txt, style);
			this._expSolved = false;
		}
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
			// give player a score and play a sound
			Bubble._score += 1;
			Bubble._scoreText.text = Bubble._score;
			this._getStar.play();
			var style = SetFontStyleExpression();
			// show the whole expression
			this._txtExpression.text = sObject.expression;
			this._expSolved = true;
			return true;
		}
		// answer incorrect: play sound
		else{
			this._wrongAnswer.play();
			this._playerHp -= 0.5;
			var sprite = this._villeArray[this._villeArray.length-1];
			sprite.alpha -= 0.5;
			if (sprite.alpha == 0) {
				var index = this._villeArray.indexOf(sprite);
				this._villeArray.splice(index, 1);
				sprite.destroy();
			}
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
		// hide extra buttons
		this.btnPause.visible = false;
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
	gameWon: function(){
		// stop the main music
		this._mainMusic.stop();
		// play game over sound
		this._winGame.play();
		// when game over, pause game
		this._paused = true;
		// hide extra buttons
		this.btnPause.visible = false;
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
	mouseClick: function(bubble){
		// collect x and y from bubble
		var bubbleX = bubble.x;
		var bubbleY = bubble.y;
		// make clicked bubble disappear;
		bubble.kill();
		bubble.bubbleText.visible = false;
		// create temporary bubble as a "ghost" of the real one
		var tempBubble = this.game.add.sprite(bubbleX, bubbleY, this._setup.bubbleColor, 0);
		tempBubble.alpha = 0.5;
		tempBubble.scale.set(0.8);
		tempBubble.anchor.setTo(0.5);
		// Enable input detection for dragging
		tempBubble.inputEnabled = true;
		// Make this bubble draggable.
		tempBubble.input.enableDrag(true);

		this.game.time.events.add(150, function() {
			// check if mouse is still pressed down
			if (this.game.input.activePointer.isDown) {
					// makes temporary bubble moveable
					tempBubble.input.startDrag(this.game.input.activePointer);
			}
			// if just a click
			else{
				/*if (!bubble.isDublicate) {
					var object = new Object();
					object.X = bubble.x-100;
					object.Y = bubble.y;
					object.number = bubble.bubbleText.text;
					Bubble.item.spawnBubble(this, this._currentExp, this._setup, object);
					object.X = bubble.x+100;
					Bubble.item.spawnBubble(this, this._currentExp, this._setup, object);
					var index = this._bubbleArray.indexOf(bubble);
					this._bubbleArray.splice(index, 1);
					tempBubble.destroy();
					bubble.bubbleText.destroy();
					bubble.destroy();
				}*/
				bubble.reset(bubbleX,bubbleY);
				bubble.bubbleText.visible = true;
				tempBubble.destroy();
			}
		}, this);
		// create variable for overalpping bubble
		var overlapBubbleIndex;
		tempBubble.events.onDragStop.add(function(){
			if (tempBubble.overlap(this._floor)) {
				// if the answer is true
				if (this.checkAnswer(this._currentExp, bubble, this.game)) {
					var index = this._bubbleArray.indexOf(bubble);
					this._bubbleArray.splice(index, 1);
					bubble.bubbleText.destroy();
					bubble.destroy();
					tempBubble.destroy();
					this.newExpression();
				}
				else{
					bubble.reset(bubbleX,bubbleY);
					bubble.bubbleText.visible = true;
					tempBubble.destroy();
				}
			}
			else{
				var check = false;
				
				var center;
				var oldCenter;
				// get index of the dragger bubble
				var index = this._bubbleArray.indexOf(bubble);
				// loop through all the bubbles in the world
				for (var i = 0; i < this._bubbleArray.length; i++) {
					if (this._bubbleArray[i] !== null && i != index) {
						// calculate distance between two object	
						center = Phaser.Point.distance(tempBubble, this._bubbleArray[i]);
						if (i==0){
							oldCenter = center;
							overlapBubbleIndex = 0;
						}
						// check the mousepointers location against bubbles in the world when released
						if (tempBubble.overlap(this._bubbleArray[i])){
							// get the overlapped bubble which is closest to the temporary bubble
							if (center<oldCenter) {
								oldCenter = center;
								overlapBubbleIndex = i;
							};
							check = true;
						}
					}
				};

				// if no hoovered bubbles founded, release base bubble and remove temporary
				if (!check) {
					bubble.reset(bubbleX,bubbleY);
					bubble.bubbleText.visible = true;
					tempBubble.destroy();
				}
				else{
					// create a string from exeption of overlapping bubbles
					var newNum = this._bubbleArray[overlapBubbleIndex].bubbleText.text + this.bubbleJoin(this._setup) + bubble.bubbleText.text;
					this._bubbleArray[overlapBubbleIndex].bubbleText.text = math.eval(newNum);
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
					tempBubble.destroy();
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
	}

};
Bubble.item = {
	// Spawn single bubble with text to the world
	spawnBubble: function(game, sObject, setup, bObject) {
			var x = null;
			var bubbleType = null;
			/*-----------------------------BUBBLE CREATION------------------------------*/
			// randomize the x-spawning point and bubble type
			x = game._bubbleSpawnX[game.rnd.integerInRange(0, 5)];
			bubbleType = game.rnd.integerInRange(0, 2)
			//spawn new bubble
			/*if (bObject!=null) {
				// spawn smaller bubbles if splitting bubble
				bubble = game.add.sprite(x, 0, game._setup.bubbleColor);
				bubble.scale.set(0.8);
				bubble.isDublicate = true;
			}
			else{*/
				bubble = game.add.sprite(x, -50, game._setup.bubbleColor);
				bubble.isDublicate = false;
			//}
			// add new animation frame & play it
			bubble.animations.add('anim', [bubbleType], 10, true);
			bubble.animations.play('anim');

			// enable bubble body for physic engine
			//TODO: SET FALSE TO EXIT DEBUGGING
			game.physics.p2.enable(bubble, true);
			bubble.checkWorldBounds = false;
			// create circular collision and
			if (bObject!=null) {
				bubble.body.setCircle(40);
			}
			else{
				bubble.body.setCircle(50);
			}
			// some rotation between 1 - 50 pixels
			bubble.body.rotateLeft(game.rnd.integerInRange(1, 50));
			// add input to bubble
			bubble.inputEnabled = true;
			/*-----------------------------TEXT CREATION------------------------------*/
			// randomize some number according to operator used in joining bubbles: '+','-','*','/'
			var number = 0;
			if (bObject!=null) {
				number = math.round(math.eval(bObject.number+"/2"),0);
			}
			else{
				number = this.generateNumber(setup, game);
			}
			var style = SetFontStyleBubble();
			bubble.bubbleText = game.add.text(bubble.x, bubble.y, number, style);
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
			// generate random number between 1 and one lesser than answer
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
			return number;
		}
		// during multiply
		else if (setup.joinOperator=="multiply") {
			// generate random number between 1 and one lesser than answer
			number = game.rnd.integerInRange(1, game._answerNum-1);
			return number;
		}
		// during divide
		else if (setup.joinOperator=="divide") {
			// generate random number between numbers in the array
			var tempArray = [2,3,5,10,(game._answerNum*(game.rnd.integerInRange(1,12)))]
			number = tempArray[game.rnd.integerInRange(0,tempArray.length-1)];
			return number;
		}
	}
};

