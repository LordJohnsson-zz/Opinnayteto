Bubble.Game = function(game){
	// define variables for Bubble.Game
	this._spawnBubbleTimer = 0;
	this._fontStyle = null;
	this._mouseBody = null;
	this._bubbleArray = new Array();
	this._bubblePos = new Array();
	this._mouseConstraint = null;
	// define Bubble variables to reuse them in Bubble.item functions
	Bubble._scoreText = null;
	Bubble._score = 0;
};
Bubble.Game.prototype = {
	create: function(){
		// start the physics engine
		this.physics.startSystem(Phaser.Physics.P2JS);
    	this.physics.p2.restitution = 0.15;
    	// set gravity for the world
		this.physics.p2.gravity.y = 50;

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
		this.physics.p2.enable([ _ground, _wall_right, _wall_left ], false);
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
		
		// spawn first 5 bubbles with spawn call
		for (var i = 0; i < 5; i++) {
			Bubble.item.spawnBubble(this);
		};
			
		// create physics body for mouse which will be used for dragging clicked bodies
		this._mouseBody = new p2.Body();
		this.physics.p2.world.addBody(this._mouseBody);

		// attach pointer events
		this.input.onDown.add(Bubble.mouse.click, this);
		this.input.onUp.add(Bubble.mouse.release, this);
		this.input.addMoveCallback(Bubble.mouse.move, this);
	        
	},
	update: function(){
		this.physics.p2.gravity.y = 50;

		// update timer every frame
		this._spawnBubbleTimer += this.time.elapsed;

		// if spawn timer reach five second (5000 milliseconds)
		if(this._spawnBubbleTimer > 500) {
			// reset it
			this._spawnBubbleTimer = 0;

			// call the spawner for bubbles
			Bubble.item.spawnBubble(this);
			
		}

		for (var i = 0; i < this._bubbleArray.length; i++) {
			// rotate every bubble for 3 pixels to left in every frame
			this._bubbleArray[i].rotateLeft(3);
		 };

		if (this._bubbleArray.length == 36) {
			// pause game for 'game over' -screen
			this.game.paused = true
			this.add.sprite((Bubble.GAME_WIDTH-594)/2, (Bubble.GAME_HEIGHT-271)/2, 'game-over');
			this.input.onDown.add(this.gameStateToMainMenu, this);
		};
	},
	// changes the game state from pause menu or 
	gameStateToMainMenu: function(){
		this.state.start('MainMenu');
	},
	// function for handling game pause
	pauseGame: function(){
		this.game.paused = true;

		this.input.onDown.add(function(self){ 
			// check wheter game is paused, if not, pause the game 
			if (this.game.paused) {
				// calculate pause-button corners
				var x1 = (Bubble.GAME_WIDTH-125), x2 = (Bubble.GAME_WIDTH-125) + 100,
					y1 = (Bubble.GAME_HEIGHT-150), y2= (Bubble.GAME_HEIGHT-150) + 100;
				
				if (event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2) {
					this.game.paused = false;
				};
			};

		},this);
	}
};
Bubble.item = {
	spawnBubble: function(game) {
		// randomize bubble type
		bubbleType = Math.floor(Math.random()*2);
		//spawn new bubble
		var bubble = game.add.sprite(game.rnd.integerInRange(5, 495), 25, 'bubbles');
		// add new animation frame & play it
		bubble.animations.add('anim', [bubbleType], 10, true);
		bubble.animations.play('anim');
		// enable bubble body for physic engine
		//TODO: SET FALSE FOR DEBUGGING
		game.physics.p2.enable(bubble, false);
		// create circular collision and
		bubble.body.setCircle(50);
		// some rotation between 1 - 50 pixels
		bubble.body.rotateLeft(Math.random()*50);
		// add bubbles to an array
		game._bubbleArray.push(bubble.body);
	},
};

/* MOUSE FUNCTIONS */
Bubble.mouse = {
	click: function(pointer) {

		var bodies = this.physics.p2.hitTest(pointer.position, this._bubbleArray);
		// p2 uses different coordinate system, so convert the pointer position to p2's coordinate system
		var physicsPos = [this.physics.p2.pxmi(pointer.position.x), this.physics.p2.pxmi(pointer.position.y)];
	
		if (bodies.length)
		{
			var clickedBody = bodies[0];
			
			var localPointInBody = [0, 0];
			// this function takes physicsPos and coverts it to the body's local coordinate system
			clickedBody.toLocalFrame(localPointInBody, physicsPos);
			
			// use a revoluteContraint to attach mouseBody to the clicked body
			this._mouseConstraint = this.physics.p2.createRevoluteConstraint(this._mouseBody, [0, 0], clickedBody, [this.physics.p2.mpxi(localPointInBody[0]), this.physics.p2.mpxi(localPointInBody[1]) ]);
		}	
	},
	release: function() {
		// remove constraint from object's body
		this.physics.p2.removeConstraint(this._mouseConstraint);

	},
	move: function(pointer) {

		// p2 uses different coordinate system, so convert the pointer position to p2's coordinate system
		this._mouseBody.position[0] = this.physics.p2.pxmi(pointer.position.x);
		this._mouseBody.position[1] = this.physics.p2.pxmi(pointer.position.y);

	}
};
