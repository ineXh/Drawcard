
var buttons = [];
var poop = [];

function preload() {
	//img = loadImage("./../assets/10.png");
}

function setup() {
	window.scrollTo(0,1);
	document.body.style.overflow = 'hidden';
	createCanvas(window.innerWidth, window.innerHeight);
	background(255);
	imageMode(CORNER);
	ellipseMode(CENTER);
	colorMode(HSB, 255);
	noStroke();
	textAlign(CENTER);
	textSize(24);

	var side = width/20;
	var index = 0;
	for(var y = 0; y < height-side; y+= side){
		for(var x = 0; x < width; x+= side){
			var c = new Square(x + side/2, y + side/2, side, 100,125,255, index);
			poop.push(c);
			index++;
		}
	}


} // end setup


function draw(){
	background(255);
	push();
        translate(0, 0);
        for (var i = 0; i < poop.length; i++) {
		    var C = poop[i];
		    C.display();
		}
    pop();
	text("" + Math.floor(mouseX) + ", " +
		Math.floor(mouseY), width*0.8, height*0.95)
}
function touchStarted(){
  //mouseClicked()
}
function mouseClicked() {
	for (var i = 0; i < buttons.length; i++) {
	    var b = buttons[i];
	    if(b.pressed()){
	    	console.log('pressed ' + i)
	    }
	}
}
