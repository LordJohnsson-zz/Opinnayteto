var normal = null;
var large = null;
var txtExp = null;
var txtBub = null;

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

function SetFontStyleExpression(){
	this.txtExp = {
		font: "46px Arial",
		fill: "#FFFFFF", 
		stroke: "#333", 
		strokeThickness: 5, 
		align: "center" 
	};

	return txtExp;
}

function SetFontStyleBubble(){
	this.txtBub = {
		font: "32px Arial",
		fill: "#ffffff", 
		align: "center" 
	};

	return txtBub;
}