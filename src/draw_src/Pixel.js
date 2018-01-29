var img;
var pgDrawing;
var urlImage;
var sendButton;
var buttons = [];
var poop = [];
var mult = 4;
var side = 8;//6*mult;
var outWidth;// = 128*mult;
var outHeight;// = 128*mult;
var hsb;

function preload() {
	img = loadImage("./../assets/whole.png");
}

function setup() {
	window.scrollTo(0,1);
	//document.body.style.overflow = 'hidden';
	createCanvas(window.innerWidth, window.innerHeight);
	background(255);
	imageMode(CORNER);
	ellipseMode(CENTER);
	colorMode(HSB, 255);
	//noStroke();
	textSize(24);

  //console.log("image width " + img.width + " image height " + img.height);
	if(img.width > img.height){
		outWidth = width;
		img.resize(outWidth,0);
	}else{
		outHeight = height/2;
		img.resize(0, outHeight);
	}
	img.loadPixels()

	hsb = extractColorFromImage(img);
	dominantHue = hsb.h;
	dominantSaturation = hsb.s;
	dominantBrightness = hsb.b;
	extractColorFromImageEdge(img);

	/*pgDrawing = createGraphics(width, height);
	//pgDrawing.beginDraw();
	//pgDrawing.background(200);
	pgDrawing.ellipseMode(CORNER);
	pgDrawing.rectMode(CORNER);
	pgDrawing.stroke(0);
	pgDrawing.strokeWeight(1);
	pgDrawing.rect(0, 0, width/8, height/8);
	pgDrawing.noStroke();
	pgDrawing.colorMode(HSB, 255);*/
	//pgDrawing.fill(30, 0.94*255, 0.98*255)
	//pgDrawing.fill(37, 0.0588*255, 238)
	//pgDrawing.ellipse(30, 30, 60, 60);
	drawImage();

	/*for(var i = 0; i < dominantHues.length-1; i++){
		fill(dominantHues[i], dominantSatuations[i], dominantBrightnesses[i]);
		ellipse(width/3 + i*width/20, height*3/4, 30, 30);
	}*/
	//pgDrawing.dispose();
	//pgDrawing.endDraw();
	var i = 0;
	for(hue in dominantHues){
		var button = new Button();
		button.init(constants.ButtonType.Circle,
			width/3 + i*width/20, height*3/4, 15,
			"", null, color(hue, dominantHues[hue].saturation, dominantHues[hue].brightness)
			);
		//fill(hue, dominantHues[hue].saturation, dominantHues[hue].brightness);
		//ellipse(width/3 + i*width/20, height*3/4, 30, 30);
		i++;
		buttons.push(button)
	}

} // end setup

function draw(){
	background(255);
	//image(pgDrawing, mouseX-30, mouseY-30);
	//image(pgDrawing, mouseX-width/2, mouseY-height/2);
	//image(pgDrawing, 0, 0, pgDrawing.width, pgDrawing.height);

	for (var i = 0; i < poop.length; i++) {
	    var C = poop[i];
	    C.display();
	}
	for (var i = 0; i < buttons.length; i++) {
	    var B = buttons[i];
	    B.display();
	}

	//fill(255,0,0)
	//rect(0, 0, width/8, height/8);
	//ellipse(mouseX-width/2, mouseY-height/2, width, height);
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
	    	var hue = Object.keys(dominantHues)[i];
	    	if(dominantHues[hue].indices == undefined) return;
	    	for(var i = 0; i < dominantHues[hue].indices.length; i++){
	    		index = dominantHues[hue].indices[i]
	    		poop[index].hide = !poop[index].hide;
	    	}
	    	//debugger;
	    	//dominantHues
	    }
	}
}
var k = 4;
function drawImage(){
  var numX = Math.ceil(img.width/side);//(int)pow(2, (k-1));//img.width;//(int)pow(2, (k-1));
  var numY = Math.ceil(img.height/side);//(int)pow(2, (k-1));//img.height;//(int)pow(2, (k-1));
  var w = side;
  var h = side;
  for(var i = 0; i < numY; i++){
    for(var j = 0; j < numX; j++){
      var x = j*w;
      var y = i*h;
      //debugger;
      var hsb = extractColorFromImageXY(img, Math.floor(x), Math.floor(y),
      										 Math.ceil(x+w), Math.ceil(y+h), constants.ExtractImageType.Section);
      x += w/2;
      y += h/2;
      //debugger;
      if(hsb.h != -1 // Not Blank
      	&& (hsb.h != dominantHue || !dominantHueEdge) // Not an edge BackColor
      	){
      	//if(hsb.h != -1){
      	//debugger;
      	if(dominantHues[hsb.h] != undefined){
      		if(Math.abs(hsb.b-dominantHues[hsb.h].brightness) < 50){
      			var C1 = new Square(x, y, w, hsb.h,
      				dominantHues[hsb.h].saturation, dominantHues[hsb.h].brightness);
      			//debugger;
      			if(dominantHues[hsb.h].indices == undefined) dominantHues[hsb.h].indices = [];
      			dominantHues[hsb.h].indices.push(poop.length);
      		}
      		else{
      			//console.log("Dominant Hues, Diff Brightness: " + hsb.h + ", " + hsb.b)
      			var C1 = new Square(x, y, w, hsb.h, hsb.s, hsb.b);
      		}
      		//debugger;
      	}else{
      		var C1 = new Square(x, y, w, hsb.h, hsb.s, hsb.b);
      		//console.log("not dominant Hues: " + hsb.h)
      		//debugger;
      	}

        poop.push(C1);
      }
    }
  }
  for (var i = 0; i < poop.length; i++) {
    var C = poop[i];
    //C.draw();
  }
} // end drawImage