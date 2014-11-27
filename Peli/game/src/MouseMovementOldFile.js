// create physics body for mouse which will be used for dragging clicked bodies
		this._mouseBody = new p2.Body();
		this.physics.p2.world.addBody(this._mouseBody);

		// attach pointer events
		this.input.onDown.add(Bubble.mouse.click, this);
		this.input.onUp.add(Bubble.mouse.release, this);
		this.input.addMoveCallback(Bubble.mouse.move, this);

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