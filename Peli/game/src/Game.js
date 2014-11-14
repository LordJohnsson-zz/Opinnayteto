Bubble.Game = function(game){
	// define variables for Bubble.Game
	this._wallCollisionGroup = null;
	this._bubbleCollisionGroup = null;
	this._spawnBubbleTimer = 0;
	this._fontStyle = null;
	this._mouseBody = null;
	// define Bubble variables to reuse them in Bubble.item functions
	Bubble._scoreText = null;
	Bubble._score = 0;
};
Bubble.Game.prototype = {
	create: function(){
		// start the physics engine
		this.physics.startSystem(Phaser.Physics.P2JS);
		this.physics.p2.gravity.y = 200;
		// turn on impact events for the world
    	this.physics.p2.setImpactEvents(true);
    	this.physics.p2.defaultRestitution = 0.8;
    	//this.physics.p2.gravity.y = 200;

    	// create collision group for bubbles
    	this._bubbleCollisionGroup = this.physics.p2.createCollisionGroup();
    	this._wallCollisionGroup = this.physics.p2.createCollisionGroup();
		this.physics.p2.updateBoundsCollisionGroup();

		// create array from backgrounds, randomly pick one & display it
		var background = ['BG1','BG2','BG3','BG4','BG5','BG6'];
		bgType = Math.floor(Math.random()*6);
		this.add.sprite(0, 0, background[bgType]);
		
		// create the ground & side walls, enable physics & make them static
		var _ground = this.add.sprite(300, 684, 'floor');
		var _wall_left = this.add.sprite(6,300,'wall_left');
		var _wall_right = this.add.sprite(594,300,'wall_right');
		this.physics.p2.enable([ _ground, _wall_right, _wall_left ], false);
		_ground.body.setCollisionGroup(this._wallCollisionGroup);
		_ground.body.collides([this._bubbleCollisionGroup]);
		_ground.body.static = true;
		_wall_left.body.setCollisionGroup(this._wallCollisionGroup);
		_wall_left.body.collides([this._bubbleCollisionGroup]);
		_wall_left.body.static = true;
		_wall_right.body.setCollisionGroup(this._wallCollisionGroup);
		_wall_right.body.collides([this._bubbleCollisionGroup]);
		_wall_right.body.static = true;

		// create the player, add player animation & play the animation
		var _ville = this.add.sprite(5, 600, 'monster-idle');
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
		Bubble._scoreText = this.add.text(84, 29.5, "0", this._fontStyle);
		
		// spawn first bubble
		Bubble.item.spawnBubble(this);

		// create physics body for mouse which will be used for dragging clicked bodies
		this._mouseBody = new p2.Body();
		this.physics.p2.world.addBody(this._mouseBody);
	        
	},
	update: function(){
		// update timer every frame
		this._spawnBubbleTimer += this.time.elapsed;
		// if spawn timer reach five second (5000 milliseconds)
		if(this._spawnBubbleTimer > 5000) {
			// reset it
			this._spawnBubbleTimer = 0;
			// and spawn new bubble
			Bubble.item.spawnBubble(this);
		}
	},
};

/* MOUSE FUNCTIONS */
Bubble.mouse = {
	click: function(pointer, bubble) {

		var bodies = this.physics.p2.hitTest(pointer.position, [bubble.body]);
		// p2 uses different coordinate system, so convert the pointer position to p2's coordinate system
		var physicsPos = [this.physics.p2.pxmi(pointer.position.x), this.physics.p2.pxmi(pointer.position.y)];
	
		if (bodies.length)
		{
			var clickedBody = bodies[0];
			
			var localPointInBody = [0, 0];
			// this function takes physicsPos and coverts it to the body's local coordinate system
			clickedBody.toLocalFrame(localPointInBody, physicsPos);
			
			// use a revoluteContraint to attach mouseBody to the clicked body
			mouseConstraint = this.game.physics.p2.createRevoluteConstraint(mouseBody, [0, 0], clickedBody, [game.physics.p2.mpxi(localPointInBody[0]), game.physics.p2.mpxi(localPointInBody[1]) ]);
		}	
	},
	release: function() {
		// remove constraint from object's body
		game.physics.p2.removeConstraint(mouseConstraint);

	},
	move: function(pointer) {

		// p2 uses different coordinate system, so convert the pointer position to p2's coordinate system
		mouseBody.position[0] = game.physics.p2.pxmi(pointer.position.x);
		mouseBody.position[1] = game.physics.p2.pxmi(pointer.position.y);

	}
};

/* BUBBLE FUNCTIONS */
Bubble.item = {
	spawnBubble: function(game){
		// calculate drop position & define the offset for every bubble
		var dropPos = Math.floor((Math.random()*(Bubble.GAME_WIDTH-115)) + 115);
	//	var dropOffset = [-75,-70,-75,-70];
		
		// randomize bubble type & create new bubble
		bubbleType = Math.floor(Math.random()*4);
		var bubble = game.add.sprite(dropPos, 98, 'bubbles');

		// add new animation frame & play it
		bubble.animations.add('anim', [bubbleType], 10, true);
		bubble.animations.play('anim');

		// enable bubble body for physic engine and add specifications
		game.physics.p2.enable(bubble, false);

		bubble.body.clearShapes();
		bubble.body.setCollisionGroup(game._bubbleCollisionGroup);
		bubble.body.collides([game._bubbleCollisionGroup, game._wallCollisionGroup]);
			//bubble.body.setCircle(98);
			//bubble.body.setRectangle(15, 15, 0, 0);
			//bubble.body.gravity.y = 200;
		
		// attach pointer events for mouse inputs
			//game.input.onDown.add(Bubble.mouse.click, game, bubble);
			//game.input.onUp.add(Bubble.mouse.release, game);
			//game.input.addMoveCallback(Bubble.mouse.move, game);
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
