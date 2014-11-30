var normal = null;
var large = null;

function SetFontStyleNormal(){
	this.normal = { 
		font: "30px Arial", 
		fill: "#FFFFFF", 
		stroke: "#333", 
		strokeThickness: 5, 
		align: "center" 
	};

	return normal;
}

function SetFontStyleLarge(){
	this.large = {
		font: "160px Arial",
		fill: "#FFFFFF", 
		stroke: "#333", 
		strokeThickness: 5, 
		align: "center" 
	};

	return large;
}