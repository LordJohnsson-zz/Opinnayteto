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
    	// variables for constructing expression
		var operator = ['+','-','/','*'];
		// randomize numbers to be used in the expression
		var n1 = game.rnd.integerInRange(1, 100);
		var n2 = game.rnd.integerInRange(1, 75);
		var n3 = game.rnd.integerInRange(1, 50);
		var n4 = game.rnd.integerInRange(1, 25);
		// array of random numbers between 1-100
		var numbers = [n1, n2, n3, n4];
    	var tempArray = new Array();
    	// firstly, create expression for the object
		for (var i = 0; i < randomInt; i++){
			// give number to the expression via temporary array
			tempArray.push(numbers[i]);
			// do before last number
			if ((randomInt-1)!=i) {
				// add operator between numbers
				tempArray.push(operator[game.rnd.integerInRange(0, 3)]);
			}
		};
		// make the expression little bit easier
		var multy = 0;
		var divid = 0;
		// secondly, go through the arrya to check the operators
		for (var i = 0; i < tempArray.length; i++) {
			// check if array has operator'multiply'
			if (tempArray[i] == "*") {
				// make expression to have only one multiply in it
				if (multy<1) {
					// check that numbers are reasonable according to each other
					if (tempArray[i-1]>10) {
						// add new value to number befor operator if over 10
						var a = game.rnd.integerInRange(2, 10);
						tempArray[i-1] = a;
					}
					if (tempArray[i+1]>10) {
						// add new value to number after operator if over 10
						var b = game.rnd.integerInRange(1, 10);
						tempArray[i+1] = b;
					}
					multy++;
				}
				// if more than one, change them to plus or minus
				else{
					var rOp = operator[game.rnd.integerInRange(0, 1)]
					tempArray[i] = rOp;
				}
			}
			// check if array has operator 'divide'
			if (tempArray[i] == "/") {
				// make the expression to have only one dividing in it
				if (divid<1) {
					// get previous number from operator
					var a = tempArray[i-1];
					// make second number automaatically less than 10 = easies the dividing
					var b = game.rnd.integerInRange(2, 10);
					// check that numbers are reasonable according to each other
					if (a<b) {
						a = a*b;
						tempArray[i-1] = a;
						tempArray[i+1] = b;
					}
					else{
						tempArray[i-1] = a-(a%b);
						tempArray[i+1] = b;
					}
					divid++;
				}
				// if more than one, change them to plus or minus
				else{
					var rOp = operator[game.rnd.integerInRange(0, 1)]
					tempArray[i] = rOp;
				}
			}
		};
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
				tempArray.push(game.rnd.integerInRange((num-15), (num+15)));
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