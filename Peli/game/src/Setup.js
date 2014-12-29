var Setup = {
	// Default game setups
    bringDefault: function(game){
    	var object = null;
    	var operator = null;
    	object = new Object();
    	// bubble dropping time in seconds
		object.dropTime = 5;
		// operator used when joining bubbles: 'addition','subtraction','multiply','divide'
		object.joinOperator = "addition";
		object.playerHP = 5;
    	object.arrayOfExpressions = new Array();
    	// indicates what is hidde in expression; 1 = one of the operands, 2 = answer, 3 = randomly one of the previous
    	object.hideNumber = 1;
    	object.allowNegatives = false;
    	// create random expressions for the object
        for (var i = 0; i < 10; i++) {
        	// create expression object 
        	var formula = new Object();
        	// create array for the expression elements
        	formula.expArray = new Array();
        	// add expression elements to the array
        	formula.expArray = this.getExpression(game.rnd.integerInRange(0, 3), game);
			// add expression as a string to object
			formula.expression = this.getExpString(formula.expArray);
			
			// add object to 
			object.arrayOfExpressions.push(formula);
        };
        return object;
    },
	// get the elements of the expression as an array = numbers used, operators and answer
    getExpression: function(operator, game){
    	// create temporary array to hold expression elements
		var tempArray = new Array();
		// create expression accoriding to operator number
		// case of addition operator
		if (operator == 0) {
			// randomize numbers for expression
	        var n1 = game.rnd.integerInRange(1, 25);
			var n2 = game.rnd.integerInRange(25, 75);
			// add numbers to array
			tempArray.push(n1);
			tempArray.push("+");
			tempArray.push(n2);
		}
		// case of subtraction operator
		else if (operator == 1) {
			// randomize numbers for expression
	        var n1 = game.rnd.integerInRange(1, 100);
			var n2 = game.rnd.integerInRange(1, 99);
			// prevent zero calculations
			if (n1==n2) {
				n1 +=1;
			}
			// add numbers to array
			if(n2>n1){
				tempArray.push(n2);
				tempArray.push("-");
				tempArray.push(n1);
			}
			else{
				tempArray.push(n1);
				tempArray.push("-");
				tempArray.push(n2);
			}
		}
		// case of multiply operator
		else if (operator == 2) {
			// randomize numbers for expression
        	var n1 = game.rnd.integerInRange(1, 10);
			var n2 = game.rnd.integerInRange(1, 10);

			tempArray.push(n1);
			tempArray.push("*");
			tempArray.push(n2);
		}
		// case of divide operator
		else if (operator == 3){
			// randomize numbers for expression		        
        	var n1 = game.rnd.integerInRange(1, 100);
			var n2 = game.rnd.integerInRange(1, 10);

			// check that numbers are reasonable according to each other
			if (n1<n2) {
				n1 = n1*n2;
				tempArray.push(n1);
				tempArray.push("/");
				tempArray.push(n2);
			}
			else{
				tempArray.push(n1-(n1%n2));
				tempArray.push("/");
				tempArray.push(n2);
			}
		}

		// Use parsing and evaluation from expression string with math.js 
		var result = math.eval(this.getExpString(tempArray));
		// add the equal sign...
		tempArray.push('=');
		// ...and the answer to the array
		tempArray.push(result);
		// Finally return the expression array 
		return tempArray;
    },
    // get string version of the expression
	getExpString: function(array){
		var expression = "";
		// loop through temp array to get result from the expression 
		for (var i = 0; i < array.length; i++) {
			if (!(array.length-1==i)){
				expression += array[i] + " ";
			}
			else{
				expression += array[i];
			}

		};
		return expression;
	},
    // Game setups brought from Ville-system
    bringVille: function(){
        
    }
};