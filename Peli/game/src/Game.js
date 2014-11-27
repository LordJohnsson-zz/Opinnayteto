Bubble.Game = function(game){
	// define variables for Bubble.Game
	this._spawnBubbleTimer = 0;
	this._startCounter = true;
	this._counter = 5;
	this._counterText = "";
	this._fontStyle = null;
	this._mouseBody = null;
	this._bubbleArray = new Array();
	this._bubblePos = new Array();
	this._mouseConstraint = null;
	// define Bubble variables to reuse them in Bubble.item functions
	Bubble._scoreText = null;
	Bubble._score = 0;
	Bubble._appearSound = null; 
};
Bubble.Game.prototype = {
	create: function(){
		// start the physics engine
		this.physics.startSystem(Phaser.Physics.P2JS);
    	this.physics.p2.restitution = 0.15;

		// create array from backgrounds, randomly pick one & display it
		var background = ['BG1','BG2','BG3','BG4','BG5','BG6'];
		bgType = Math.floor(Math.random()*6);
		this.add.sprite(0, 0, background[bgType]);
		this.add.sprite(0,600, 'FloorBox');

		// add pause button
		this.add.button(Bubble.GAME_WIDTH-125, Bubble.GAME_HEIGHT-150, 'button-pause', this.pauseGame, this, 0,0,1);

		// create the ground & side walls
		var _ground = this.add.sprite(300, 700, 'floor');
		var _wall_left = this.add.sprite(-5,300,'wall_left');
		var _wall_right = this.add.sprite(604,300,'wall_right');

		// enable physics to objects & make them static
		//TODO: SET FALSE FOR DEBUGGING
		this.physics.p2.enable([ _ground, _wall_right, _wall_left ], true);
		_ground.body.static = true;
		_wall_left.body.static = true;
		_wall_right.body.static = true;

		// create the player, add player animation & play the animation
		var _ville = this.add.sprite(15, 620, 'monster-idle');
		_ville.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12], 10, true);
		_ville.animations.play('idle');

		// set font style
		this._fontStyle = { 
			font: "30px Arial", 
			fill: "#FFFFFF", 
			stroke: "#333", 
			strokeThickness: 5, 
			align: "center" 
		};
		
		// initialize the spawn timer
		this._spawnBubbleTimer = 0;
		// add score image & initialize the score text with 0
		this.add.sprite(0, 0, 'score-bg');
		this._scoreText = this.add.text(84, 29.5, "0", this._fontStyle);
		// initialize sound
		this._appearSound = this.game.add.audio('bubble_appear');

		// spawn first 5 bubbles with spawn call
		for (var i = 0; i < 5; i++) {
			Bubble.item.spawnBubble(this);
		};
	},
	update: function(){
		// set gravity for the world
		this.physics.p2.gravity.y = 100;

		// update timer every frame
		this._spawnBubbleTimer += this.time.elapsed;

		// start game counter
		if (this._startCounter) {
			var startFont = {
				font: "160px Arial",
				fill: "#FFFFFF", 
				stroke: "#333", 
				strokeThickness: 5, 
				align: "center" 
			};

			// if spawn timer reach one second (1000 milliseconds)
			if(this._spawnBubbleTimer > 1000) {
				if (this._counterText != ""){ 
					// erase the counter text
					this._counterText.destroy();
				};
				// reset it
				this._spawnBubbleTimer = 0;
				// print counter text
				this._counterText = this.add.text(this.world.centerX-50, this.world.centerY-150, this._counter, startFont);
				this._counter -= 1;

				if (this._counter < 0){
					this._startCounter = false;
				}
			}

		}
		else{

			// if spawn timer reach five second (5000 milliseconds)
			if(this._spawnBubbleTimer > 5000) {
				// reset it
				this._spawnBubbleTimer = 0;
				// call the spawner for bubbles
				Bubble.item.spawnBubble(this);
			}

			// add some movement to bubbles
			for (var i = 0; i < this._bubbleArray.length; i++) {
				// rotate every bubble for 3 pixels to left in every frame
				this._bubbleArray[i].events.onInputDown.add(this.mouseClick, this);
			 }

			// add end game condition if too many bubbles in the screen
			if (this._bubbleArray.length == 36) {
				// pause game for 'game over' -screen
				this.game.paused = true
				this.add.sprite((Bubble.GAME_WIDTH-594)/2, (Bubble.GAME_HEIGHT-271)/2, 'game-over');
				this.input.onDown.add(function(){
					// go back to mainmenu
					this.gameStateToMainMenu();
				},this);
			}
		}
	},
	// changes the game state from pause menu or 
	gameStateToMainMenu: function(){
		this.state.start('MainMenu');
	},
	// function for handling game pause
	pauseGame: function(){
		this.game.paused = true;

		this.input.onDown.add(function(){
			// unpause the game
			this.game.paused = false;
		},this);
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
				// check the mousepointers location against bubbles in the world when released
				if (tempBubble.overlap(this._bubbleArray[i])){
					var index = this._bubbleArray.indexOf(bubble);
					if (index > -1) {
						this._bubbleArray.splice(index, 1);
					}
					bubble.destroy();
					tempBubble.destroy();
					check = false;
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
		var bubble = game.add.sprite(game.rnd.integerInRange(15, 495), 35, 'bubbles');
		// add new animation frame & play it
		bubble.animations.add('anim', [bubbleType], 10, true);
		bubble.animations.play('anim');

		// enable bubble body for physic engine
		//TODO: SET FALSE FOR DEBUGGING
		game.physics.p2.enable(bubble, true);
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

