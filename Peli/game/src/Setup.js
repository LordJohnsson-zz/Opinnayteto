var Setup = {
	// Default game setups
    bringDefault: function(game){
    	var object = 0;
    	object = new Array();
    	// create random expressions for the object
        for (var i = 0; i < 10; i++) {
        	// create expression object 
        	var formula = new Object();
        	// create array for the expression elements
        	formula.expArray = new Array();
        	// create array for alternative answers
			formula.altsArray = new Array();
			// randomize the numbers used in the expression
        	var r1 = game.rnd.integerInRange(2, 4);
        	// add expression elements to the array
        	formula.expArray = this.getExpression(r1, game);
			// add expression answer to object
			formula.answer = formula.expArray[formula.expArray.length-1];
			// add expression as a string to object
			formula.expression = this.getExpString(formula.expArray);
			
			// add alternative answers to the array
			formula.altsArray = this.getAlternatives(formula.expArray, r1, game);
			
			object.push(formula);
        };
        return object;
    },
	// get the elements of the expression as an array = numbers used, operators and answer
    getExpression: function(randomInt, game){
    	// create temporary array to hold expression elements
		var tempArray = new Array();
		// create expression accoriding to random number
    	switch (randomInt) {
    		// case of plus operator
		    case 0:
		    	// randomize numbers for expression
		        var n1 = game.rnd.integerInRange(1, 100);
				var n2 = game.rnd.integerInRange(1, 100);
				// add numbers to array
				tempArray.push(n1);
				tempArray.push("+");
				tempArray.push(n2);
		        break;
		    // case of minus operator
		    case 1:
		    	// randomize numbers for expression
		        var n1 = game.rnd.integerInRange(1, 100);
				var n2 = game.rnd.integerInRange(1, 100);
				// add numbers to array
				
				tempArray.push("-");
				tempArray.push(n2);

		        break;
		    // case of multiply operator
	        case 2:
	        	// randomize numbers for expression
	        	var n1 = game.rnd.integerInRange(1, 10);
				var n2 = game.rnd.integerInRange(1, 10);

				tempArray.push(n1);
				tempArray.push("*");
				tempArray.push(n2);
		        break;
		    // case of divide operator
	        case 3:
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
		        break;
		    // back-up if something fails
		    default: 
		        // randomize numbers for expression
		        var n1 = game.rnd.integerInRange(1, 100);
				var n2 = game.rnd.integerInRange(1, 100);
				// add numbers to array
				tempArray.push(n1);
				tempArray.push("+");
				tempArray.push(n2);
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
	// Form alternative anwers to be set into Bubbles
    getAlternatives: function(array, randomInt, game){
		var tempArray = new Array();
		var num = 0;
		for (var i = 0; i < (randomInt*5); i++) {
			// get number from numbers used in the expression
			if (i<array.length) {
				// if array contains operator, gives the answer as number to use
				num = (array[i] == "+" || array[i] == "-" || array[i] == "*" || array[i] == "/" || array[i] == "=") ? array[array.length-1] :  parseInt(array[i]);
				tempArray.push(num);
			}
			// otherwise get numbers accoridng to answer only 
			else{
				tempArray.push(game.rnd.integerInRange((array[array.length-1]-15), (array[array.length-1]+15)));
			}
			if (i == (randomInt*5)-1) {
				tempArray.push(array[array.length-1]);
			}
		};
		return tempArray;
    },
    // Game setups brought from Ville-system
    bringVille: function(){
        
    }
};