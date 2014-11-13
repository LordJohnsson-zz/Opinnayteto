Bubble.Game = function(game){
	// define needed variables for Bubble.Game
	this._player = null;
	this._wallGroup = null;
	this._bubbleGroup = null;
	this._spawnBubbleTimer = 0;
	this._fontStyle = null;
	this._ground = null;
	this._wall = null;
	// define Bubble variables to reuse them in Bubble.item functions
	Bubble._scoreText = null;
	Bubble._score = 0;
};
Bubble.Game.prototype = {
	create: function(){
		// start the physics engine
		this.physics.startSystem(Phaser.Physics.ARCADE);
		// set the global gravity
			//this.physics.arcade.gravity.y = 200;
		// display images background & score
		this.add.sprite(0, 0, 'background');
		this.add.sprite(0, 0, 'score-bg');
		// wall group contains the walls where bubbles will collide
		_wallGroup = this.add.group();
		// enable physics for any object that is created in this group
		_wallGroup.enableBody = true;
		// create the ground
		this._ground = _wallGroup.create(0, Bubble.GAME_HEIGHT-169, 'floor');
		//  This stops it from falling away when bubbles hit it
    	this._ground.body.immovable = true;
   		// create side walls
			//this._wall = _wallGroup.create(0,0,'');
			//this._wall.body.immovable = true;
			//this._wall = _wallGroup.create(Bubble.GAME_WIDTH-2,0,'');
			//this._wall.body.immovable = true;
		// add pause button
			//this.add.button(Bubble.GAME_WIDTH-96-10, 5, 'button-pause', this.managePause, this);
		// create the player
		this._player = this.add.sprite(5, 660, 'monster-idle');
		// add player animation
		this._player.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12], 10, true);
		// play the animation
		this._player.animations.play('idle');
		// set font style
		this._fontStyle = { font: "30px Arial", fill: "#FFFFFF", stroke: "#333", strokeThickness: 5, align: "center" };
		// initialize the spawn timer
		this._spawnBubbleTimer = 0;
		// initialize the score text with 0
		Bubble._scoreText = this.add.text(84, 29.5, "0", this._fontStyle);
		// create new group for bubble
		this._bubbleGroup = this.add.group();
		//  enable physics for any bubble that is created in this group
    	this._bubbleGroup.enableBody = true;
		// spawn first bubble
		Bubble.item.spawnBubble(this);
	},
	/*managePause: function(){
		// pause the game
			this.game.paused = true;
		// add proper informational text
			var pausedText = this.add.text(100, 250, "Game paused.\nTap anywhere to continue.", this._fontStyle);
		// set event listener for the user's click/tap the screen
			this.input.onDown.add(function(){
				// remove the pause text
				pausedText.destroy();
				// unpause the game
				this.game.paused = false;
			}, this);
	},*/
	update: function(){
		//  Collide the bubbles with the walls and other bubbles
		this.physics.arcade.collide(this._bubbleGroup, _wallGroup);
		this.physics.arcade.collide(this._bubbleGroup, this._bubbleGroup);
		// update timer every frame
		this._spawnBubbleTimer += this.time.elapsed;
		// if spawn timer reach five second (5000 miliseconds)
		if(this._spawnBubbleTimer > 1000) {
			// reset it
			this._spawnBubbleTimer = 0;
			// and spawn new bubble
			Bubble.item.spawnBubble(this);
		}
		// loop through all bubble on the screen
		this._bubbleGroup.forEach(function(bubble){
			// to rotate them accordingly
			bubble.angle += bubble.rotateMe;
		});
	}
};

Bubble.item = {
	spawnBubble: function(game){
		// calculate drop position (from 0 to game width) on the x axis
		var dropPos = Math.floor(Math.random()*Bubble.GAME_WIDTH+100);
		// define the offset for every bubble
			//var dropOffset = [-27,-36,-36,-38,-48];
		// randomize bubble type
			//var bubbleType = Math.floor(Math.random()*5);
		// create new bubble: game.add.sprite(dropPos,dropOffset[bubbleType], 'bubble');
		var bubble = game.add.sprite(dropPos, -98, 'bubble');
		// add new animation frame
		bubble.animations.add('anim', [0], 10, true);
		// play the newly created animation
		bubble.animations.play('anim');
		// enable bubble body for physic engine
		game.physics.enable(bubble, Phaser.Physics.ARCADE);
		// enable bubble to be clicked/tapped
		bubble.inputEnabled = true;
		// add event listener to click/tap
		bubble.events.onInputDown.add(this.clickBubble, this);
		// add gravity to bubble
		bubble.body.gravity.y = 200;
		// set the anchor (for rotation, position etc) to the middle of the bubble
		bubble.anchor.setTo(0.5, 0.5);
		// set the random rotation value
		bubble.rotateMe = (Math.random()*4)-2;
		// add bubble to the group
		game._bubbleGroup.add(bubble);
	},
	clickBubble: function(bubble){
		// kill the bubble when it's clicked
		bubble.kill();
		// add points to the score
		Bubble._score += 1;
		// update score text
		Bubble._scoreText.setText(Bubble._score);
	},
	removeBubbles: function(bubble){
		// kill the bubble
		bubble.kill();
	}
};
