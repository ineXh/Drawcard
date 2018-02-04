var img;
var urlImage;
var pgDrawing;
var buttons = [];
var buttonTranslateX;
var poop = [];
var poopTranslateX;
var poopTranslateY;
var screenTranslateX;
var screenTranslateY;
var mult = 4;
var side = 64;//6*mult;
var outWidth;// = 128*mult;
var outHeight;// = 128*mult;

function preload() {
	img = loadImage("./../assets/whole.png");
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
	textSize(24);


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


} // end setup
var finishedSetup = false;
function setupImage(img){
	if(finishedSetup) return;
	if(img.width < 2) return;
	if(img.width > img.height){
		outWidth = width;
		img.resize(outWidth,0);
	}else{
		outHeight = height/2;
		img.resize(0, outHeight);
	}
	poopTranslateX = (width-img.width)/2;
	poopTranslateY = height*0.1;
	img.loadPixels()

	var hsb = extractColorFromImage(img);
	dominantHue = hsb.h;
	dominantSaturation = hsb.s;
	dominantBrightness = hsb.b;
	extractColorFromImageEdge(img);

	drawImage();

	var i = 0;
	for(hue in dominantHues){
		//if(dominantHues[hue].indices == undefined) debugger;
		if(dominantHues[hue].indices == undefined
		&& dominantHues[hue].diffBrightnessIndices == undefined) continue;

		//console.log('hue ' + hue)
		var button = new Button();
		button.init(constants.ButtonType.Circle,
			i*width/20, height*9/10, 15,
			"", null,
			color(hue, dominantHues[hue].saturation, dominantHues[hue].brightness)
			);
		button.hue = hue;
		//fill(hue, dominantHues[hue].saturation, dominantHues[hue].brightness);
		//ellipse(width/3 + i*width/20, height*3/4, 30, 30);
		i++;
		buttons.push(button)
	}
	buttonTranslateX = (1-buttons[buttons.length-1].pos.x/width)/2 * width;
	finishedSetup = true;
} // end setupImage

function draw(){
	background(255);
	//image(pgDrawing, 0, 0, pgDrawing.width, pgDrawing.height);
	if(img) setupImage(img);
	push();
        translate(poopTranslateX, poopTranslateY);
        for (var i = 0; i < poop.length; i++) {
		    var C = poop[i];
		    C.display();
		}
    pop();
    push();
    	translate(buttonTranslateX, 0);
		for (var i = 0; i < buttons.length; i++) {
		    var B = buttons[i];
		    B.display();
		}
	pop();
	//text("" + Math.floor(mouseX) + ", " +
	//	Math.floor(mouseY), width*0.8, height*0.95)
}
function touchStarted(){
  //mouseClicked()
}
function mouseClicked() {
	for (var i = 0; i < buttons.length; i++) {
	    var button = buttons[i];
	    if(button.pressed(mouseX - buttonTranslateX, mouseY)){
	    	//console.log('pressed ' + i)
	    	var hue = button.hue;
	    	//var hue = Object.keys(dominantHues)[i];
	    	//if(dominantHues[hue] == undefined) debugger;
	    	if(dominantHues[hue].indices == undefined &&
	    		dominantHues[hue].diffBrightnessIndices == undefined) return;
	    	if(dominantHues[hue].indices != undefined){
	    		for(var k = 0; k < dominantHues[hue].indices.length; k++){
		    		index = dominantHues[hue].indices[k]
		    		poop[index].hide = !poop[index].hide;
		    	}
	    	}
	    	if(dominantHues[hue].diffBrightnessIndices != undefined){
	    		for(var k = 0; k < dominantHues[hue].diffBrightnessIndices.length; k++){
		    		index = dominantHues[hue].diffBrightnessIndices[k]
		    		poop[index].hide = !poop[index].hide;
		    	}
	    	}
	    } // end button pressed
	}
} // end mouseClicked
function printPoopActive(){
	for(var i = 0; i < poop.length; i++){
		if(poop[i].hide == false) console.log(i)
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
      if(
      	true
       //   hsb.h != -1 // Not Blank
      //&& (hsb.h != dominantHue || !dominantHueEdge) // Not an edge BackColor
      	){
      	//if(hsb.h != -1){
      	//debugger;
      	if(dominantHues[hsb.h] != undefined){
      		if(Math.abs(hsb.b-dominantHues[hsb.h].brightness) < 25){
      			var C1 = new Square(x, y, w, hsb.h,
      				dominantHues[hsb.h].saturation, dominantHues[hsb.h].brightness);
      			//var C1 = new Square(x, y, w, hsb.h, hsb.s, hsb.b);
      			//debugger;
      			if(dominantHues[hsb.h].indices == undefined) dominantHues[hsb.h].indices = [];
      			dominantHues[hsb.h].indices.push(poop.length);
      		}else{
      			//console.log("Dominant Hues, Diff Brightness: " + hsb.h + ", " + (hsb.b-dominantHues[hsb.h].brightness))
      			var C1 = new Square(x, y, w, hsb.h, hsb.s, hsb.b);
      			if(dominantHues[hsb.h].diffBrightnessIndices == undefined) dominantHues[hsb.h].diffBrightnessIndices = [];
      			dominantHues[hsb.h].diffBrightnessIndices.push(poop.length);
      		}
      		//debugger;
      	}else{
      		//if (dominantHues[1000] == undefined) {dominantHues[1000] = {indices:[]}}
      		var last = 1000;
      		var lastHueIndex = 0;
      		for(var hueIndex in dominantHues){
      			diff = Math.abs(hsb.h - parseInt(hueIndex))
      			if(diff < last) last = diff;
      			if(diff > last){
      				//debugger;
      				break;
      			}
      			lastHueIndex = parseInt(hueIndex)
      		}
      		var C1 = new Square(x, y, w, hsb.h, hsb.s, hsb.b);
      		//var C1 = new Square(x, y, w, lastHueIndex,
      		//		dominantHues[lastHueIndex].saturation, dominantHues[lastHueIndex].brightness);
      		//console.log("not dominant Hues: " + hsb.h)
      		if(dominantHues[lastHueIndex].indices == undefined) dominantHues[lastHueIndex].indices = [];
      		dominantHues[lastHueIndex].indices.push(poop.length);
      		//dominantHues[1000].indices.push(poop.length);
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