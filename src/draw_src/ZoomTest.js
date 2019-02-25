
var buttons = [];
var balls = [];
var poop = [];
var tree;
var stageWidth, stageHeight;
function preload() {
	//img = loadImage("./../assets/10.png");
}

function setup() {
	window.scrollTo(0,1);
	document.body.style.overflow = 'hidden';
	createCanvas(window.innerWidth, window.innerHeight);
	frameRate(50);
	background(255);
	imageMode(CORNER);
	ellipseMode(CENTER);
	colorMode(RGB, 255);
	
	textAlign(CENTER);
	textSize(24);
	stageWidth = width;
	stageHeight = height;
	stroke(color(0, 0, 0));
	strokeWeight(2);
	tree = new QuadTree(width, height);
	
	for(var i = 0; i < 10; i++){
		ball = new Ball(random(0, width), random(0, height), 20, true);
		balls.push(ball);
		tree.insert(ball);
	}
	stroke(color(0, 0, 0));
	strokeWeight(2);
	//noStroke();
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
	fill(0,50)
	for(var i = 0; i < tree.nodes[2].length; i++){
      if(tree.nodes[2][i].active) tree.nodes[2][i].draw();
    }
	//tree.update();
	for(i in balls){
		balls[i].update();
	}
	push();
        translate(0, 0);
        for (var i = 0; i < poop.length; i++) {
		    var C = poop[i];
		    //C.display();
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
