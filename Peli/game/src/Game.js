Bubble.Game = function(game){
	// define variables for Bubble.Game
	this._spawnBubbleTimer = 0;
	this._start = true;
	this._counter = 5;
	this._counterText = "";
	this._fontStyle = null;
	this._bubbleArray = 0;
	this._paused = true;
	this.btnPause = null;
	this._ville = null;
	this._reload = false;
	// define Bubble variables to reuse them in Bubble.item functions
	Bubble._scoreText = null;
	Bubble._score = 0;
	Bubble._appearSound = null; 
};
Bubble.Game.prototype = {
	create: function(){
		if (this._reload) {
			this.setVariables();
		}
		// start the physics engine
		this.physics.startSystem(Phaser.Physics.P2JS);
    	this.physics.p2.restitution = 0.25;
    	this.physics.p2.setBounds(10,0,590,600,true,true,false,true);
    	// set gravity for the world
		this.physics.p2.gravity.y = 75;

		// create array from backgrounds, randomly pick one & display it
		var background = ['BG1','BG2','BG3','BG4','BG5','BG6'];
		bgType = Math.floor(Math.random()*6);
		this.add.sprite(0, 0, background[bgType]);
		this.add.sprite(0,600, 'FloorBox');

		// create the ground & side walls
		var _ground = this.add.sprite(300, 700, 'floor');
		var _wall_left = this.add.sprite(-5,300,'wall_left');
		var _wall_right = this.add.sprite(604,300,'wall_right');

		// enable physics to objects & make them static
		//TODO: SET FALSE FOR DEBUGGING
		this.physics.p2.enable([ _ground,_wall_left,_wall_right], true);
		_ground.body.static = true;
		_wall_left.body.static = true;
		_wall_right.body.static = true;

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

		// create new array for bubbles
		this._bubbleArray = new Array();
		// spawn first 5 bubbles with spawn call
		for (var i = 0; i < 5; i++) {
			Bubble.item.spawnBubble(this);
		};

		// add pause button
		this.btnPause = this.add.button(Bubble.GAME_WIDTH-125, Bubble.GAME_HEIGHT-150, 'button-pause', this.pauseGame, this, 0,0,1);
		// add in-game menu panel 
		this.pausePanel = new PauseButton(this.game);
		this.game.add.existing(this.pausePanel);

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
			
		}
	},
	setVariables: function(){
		// reset variables
		this._spawnBubbleTimer = 0;
		this._start = true;
		this._counter = 5;
		this._counterText = "";
		this._fontStyle = null;
		this._bubbleArray = 0;
		this._paused = true;
		this.btnPause = null;
		this._ville = null;
		this._reload = false;
		Bubble._scoreText = null;
		Bubble._score = 0;
		Bubble._appearSound = null; 
	},
	// function for handling game pause
	pauseGame: function(){
		if (!this._paused){
			// stop the game
			this._paused = true;
			this.btnPause.kill();
			this._reload = true;
			// show pause menu
			this.pausePanel.show();
			// hide all bubbles
			for (var i = 0; i < this._bubbleArray.length; i++) {
				if (this._bubbleArray[i] != null) {
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
			this.btnPause.revive();
			this._reload = false;
			// hide pause menu
			this.pausePanel.hide();
			// show all bubbles
			for (var i = 0; i < this._bubbleArray.length; i++) {
				if (this._bubbleArray[i] != null) {
					if (!this._bubbleArray[i].alive) {
						this._bubbleArray[i].revive();
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
				 	game._counterText = game.add.text(game.world.centerX-200, game.world.centerY-150, "Anna mennä!", startFont);
				 	game._counterText.fontSize = 75;
				}
				else{
					game._counterText = game.add.text(game.world.centerX-50, game.world.centerY-150, game._counter, startFont);
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
				Bubble.item.spawnBubble(game);
			}

			// add some movement to bubbles
			for (var i = 0; i < game._bubbleArray.length; i++) {
				if (game._bubbleArray[i]!=null) {
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
		this._paused = true;
		this.add.button((Bubble.GAME_WIDTH-594)/2, (Bubble.GAME_HEIGHT-271)/2,'game-over', this.toMainMenu, this, 0, 0, 0);
	},
	// changes the game state from pause menu or 
	toMainMenu: function(){
		this.state.start('MainMenu');
	},
	mouseClick: function(bubble){
		// collect x and y from bubble
		var bubbleX = bubble.x;
		var bubbleY = bubble.y;
		// make clicked bubble disappear;
		bubble.kill();
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
				if (this._bubbleArray[i] != null) {
					// check the mousepointers location against bubbles in the world when released
					if (tempBubble.overlap(this._bubbleArray[i])){
						var index = this._bubbleArray.indexOf(bubble);
						if (index > -1) {
							this._bubbleArray.splice(index, 1);
							this._bubbleArray[index] = null;
						}
						bubble.destroy();
						tempBubble.destroy();
						check = false;
					}
				}
			};
			// if no hoovered bubbles founded, release base bubble and remove temporary
			if (check) {
				bubble.reset(bubbleX,bubbleY);
				tempBubble.destroy();
			}
		}, this);
		
	}

};
Bubble.item = {
	spawnBubble: function(game) {
			// randomize bubble type
			bubbleType = Math.floor(Math.random()*2);
			
			//spawn new bubble
			var bubble = game.add.sprite(game.rnd.integerInRange(25, 495), -50, 'bubbles');
			// add new animation frame & play it
			bubble.animations.add('anim', [bubbleType], 10, true);
			bubble.animations.play('anim');

			// enable bubble body for physic engine
			//TODO: SET FALSE FOR DEBUGGING
			game.physics.p2.enable(bubble, true);
			bubble.checkWorldBounds = true;

			// create circular collision and
			bubble.body.setCircle(50);
			// some rotation between 1 - 50 pixels
			bubble.body.rotateLeft(Math.random()*50);
			// add bubbles to an array
			game._bubbleArray.push(bubble);

			// add input
			bubble.inputEnabled = true;

			//play appearing sound
			game._appearSound.play();
	}
};

