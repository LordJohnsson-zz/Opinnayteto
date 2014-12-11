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
		this.add.sprite(0,600, 'FloorBox');

		// create the player, add player animation & play the animation
		this._ville = this.add.sprite(15, 620, 'monster-idle');
		this._ville.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12], 10, true);
		this._ville.animations.play('idle');

		// set font style
		this._fontStyle = SetFontStyleNormal();
		
		// initialize the spawn timer
		this._spawnBubbleTimer = 0;
		// add score image & initialize the score text with 0
		this.add.sprite(0, 0, 'score-bg');
		this._scoreText = this.add.text(84, 29.5, "0", this._fontStyle);
		// initialize sound
		this._appearSound = this.game.add.audio('bubble_appear');
		this._buttonSoundClick = this.game.add.audio('buttonClick');
		this._gameOverSound = this.game.add.audio('gameOver');
		this._counterSound = this.game.add.audio('counter');

		// create new array for bubbles and x -spawning point
		this._bubbleArray = new Array();
		
		// get the first expression
		this._currentExp = this._setup[this.rnd.integerInRange(0, this._setup.length-1)];

		// spawn first 5 bubbles with spawn call
		for (var i = 0; i < 5; i++) {	
			Bubble.item.spawnBubble(this, this._currentExp);
		};

		// add pause button
		this.btnPause = this.add.button(Bubble.GAME_WIDTH-125, Bubble.GAME_HEIGHT-150, 'button-pause', this.pauseGame, this, 0,0,1);
		// add in-game menu panels
		this.pausePanel = new PausePanel(this.game);
		this.add.existing(this.pausePanel);
		this.endPanel = new GameOverPanel(this.game);
		this.add.existing(this.endPanel);

		this.endPanel.hide();

		this.playGame();
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
			
		}
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
		this._ville = null;
		this._setup = null;
		this._currentExp = null;
		// define Bubble variables to reuse them in Bubble.item functions
		Bubble._scoreText = null;
		Bubble._score = 0;
	},
	// function for handling game pause
	pauseGame: function(){
		// add pause click sound effect
		this._buttonSoundClick.play();
		if (!this._paused){
			// stop the game
			this._paused = true;
			this.btnPause.visible = false;
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

			// if spawn timer reach five second (5000 milliseconds)
			if(game._spawnBubbleTimer > 5000) {
				// reset it
				game._spawnBubbleTimer = 0;
				// call the spawner for bubbles
				Bubble.item.spawnBubble(game, this._currentExp);
			}

			// add events to bubble
			for (var i = 0; i < game._bubbleArray.length; i++) {
				if (game._bubbleArray[i] !== null) {
					// rotate every bubble for 3 pixels to left in every frame
					game._bubbleArray[i].events.onInputDown.add(game.mouseClick, this);
					// check that bubble is inside game
					game._bubbleArray[i].events.onOutOfBounds.add(game.gameOver, this);
			 	}
			}
		}
	},
	// to end game
	gameOver: function(){
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
	},
	mouseClick: function(bubble){
		// collect x and y from bubble
		var bubbleX = bubble.x;
		var bubbleY = bubble.y;
		// make clicked bubble disappear;
		bubble.kill();
		bubble.bubbleText.visible = false;
		// create temporary bubble as a "ghost" of the real one
		var tempBubble = this.game.add.sprite(bubbleX, bubbleY, 'bubbles', 0);
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

		}, this);

		tempBubble.events.onDragStop.add(function(){
			var check = true;
			// loop through all the bubbles in the world
			for (var i = 0; i < this._bubbleArray.length; i++) {
				if (this._bubbleArray[i] !== null) {
					// check the mousepointers location against bubbles in the world when released
					if (tempBubble.overlap(this._bubbleArray[i])){
						// get index of the dragger bubble
						var index = this._bubbleArray.indexOf(bubble);
						// create a string from exeption of overlapping bubbles
						var newNum = this._bubbleArray[i].bubbleText.text + "+(" + bubble.bubbleText.text + ")";
						this._bubbleArray[i].bubbleText.text = math.eval(newNum);
						// check if index is there and shorten the array
						if (index > -1) {
							this._bubbleArray.splice(index, 1);
							bubble.bubbleText.destroy();
							bubble.destroy();		
						}
						tempBubble.destroy();
						check = false;
					}
				}
			};
			// if no hoovered bubbles founded, release base bubble and remove temporary
			if (check) {
				bubble.reset(bubbleX,bubbleY);
				bubble.bubbleText.visible = true;
				tempBubble.destroy();
			}
		}, this);
		
	}

};
Bubble.item = {
	// Spawn single bubble with text to the world
	spawnBubble: function(game, sObject) {
			var x = null;
			var bubbleType = null;
			/*-----------------------------BUBBLE CREATION------------------------------*/
			// randomize the x-spawning point and bubble type
			x = game._bubbleSpawnX[game.rnd.integerInRange(0, 5)];
			bubbleType = game.rnd.integerInRange(0, 2)
			//spawn new bubble
			bubble = game.add.sprite(x, -50, 'bubbles');
			// add new animation frame & play it
			bubble.animations.add('anim', [bubbleType], 10, true);
			bubble.animations.play('anim');

			// enable bubble body for physic engine
			//TODO: SET FALSE TO EXIT DEBUGGING
			game.physics.p2.enable(bubble, true);
			bubble.checkWorldBounds = true;
			// create circular collision and
			bubble.body.setCircle(50);
			// some rotation between 1 - 50 pixels
			bubble.body.rotateLeft(game.rnd.integerInRange(1, 50));
			// add input to bubble
			bubble.inputEnabled = true;
			/*-----------------------------TEXT CREATION------------------------------*/
			// randomize some number from alternative array
			var number = sObject.altsArray[game.rnd.integerInRange(0, sObject.altsArray.length-1)]
			var style = { font: "32px Arial", fill: "#ffffff", align: "center" };
			bubble.bubbleText = game.add.text(bubble.x, bubble.y, number, style);
			bubble.bubbleText.anchor.set(0.5);
			// add object to an array
			game._bubbleArray.push(bubble);
			//play appearing sound
			game._appearSound.play();
	}
};

