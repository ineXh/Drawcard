var img;
var imgZoomIn;
var imgZoomOut;
var imgCircle;
var buttonZoomIn;
var buttonZoomOut;
var urlImage;
var pgDrawing;
var buttons = [];
var buttonTranslateX;
var poop = [];
var poopList = {};
var poopTranslateX;
var poopTranslateY;
var screenCurrentTranslateX = 0;
var screenCurrentTranslateY = 0;
var screenInitialTranslateX = 0;
var screenInitialTranslateY = 0;
var screenTotalTranslateX = 0;
var screenTotalTranslateY = 0;
var screenTranslateScale = 1.0;
var screenScale = 1.0;

var screenCenterX = 0;
var screenCenterY = 0;

var mult = 4;
var side = 64;//6*mult;
var outWidth;// = 128*mult;
var outHeight;// = 128*mult;

function preload() {
	imgZoomIn = loadImage("./../assets/zoomin.png");
	imgZoomOut = loadImage("./../assets/zoomout.png");
	//imgCircle = loadImage("./../assets/circle.png");
	//img = loadImage("./../assets/whole.png");
	//img = loadImage("./../assets/airport-photo.jpg");
}

var reload = function(input){
  //centerText("reload", width/2, height/2);
  //centerText(input, width/2, height*3/4);
	side = Math.floor(64/parseInt(input));

	background(255);
	finishedSetup = false;
	poop.length = 0;
	poopList = {};
	dominantHues = {};
	buttons.length = 0;
	draw();
}

function setup() {
	window.scrollTo(0,1);
	document.body.style.overflow = 'hidden';
	createCanvas(window.innerWidth, window.innerHeight);
	//createCanvas(300, 300);
	background(255);
	imageMode(CORNER);
	ellipseMode(CENTER);
	colorMode(HSL, hueRange);
	noStroke();
	textSize(24);

	
	buttonZoomOut = new Button();
	buttonZoomOut.init(constants.ButtonType.Image,
			width*0.72, height*0.85, width*0.06,
			"", imgZoomOut,
			color(200)
			);
	buttonZoomIn = new Button();
	buttonZoomIn.init(constants.ButtonType.Image,
			width*0.87, height*0.85, width*0.06,
			"", imgZoomIn,
			color(200)
			);
	// uncomment
	sendMsg('getDataUrl', null, takeImage);
	//
	//width*0.9, height*0.9, width*0.04, width*0.04


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
	poopTranslateX = 0;//(width-img.width)/2;
	poopTranslateY = 0;//height*0.1;
	img.loadPixels()

	var hsb = extractColorFromImage(img);
	dominantHue = hsb.h;
	dominantSaturation = hsb.s;
	dominantBrightness = hsb.b;
	extractColorFromImageEdge(img);

	drawImage();

	var i = 0;
	var colors = [];
	for(hue in dominantHues){
		//if(dominantHues[hue].indices == undefined) debugger;
		if(dominantHues[hue].indices == undefined
		&& dominantHues[hue].diffBrightnessIndices == undefined) continue;

		//console.log('hue ' + hue)
		colors.push(hue)
		colors.push(dominantHues[hue].saturation/hueRange)
		colors.push(dominantHues[hue].brightness/hueRange)
		var button = new Button();
		if(i < 6){
			x = i*width*0.15
			y = height*0.75
		}else{
			x = (i-6)*width*0.15
			y = height*0.85
		}
		button.init(constants.ButtonType.Circle,
			x, y, width*0.06,
			"", null,
			color(hue, dominantHues[hue].saturation, dominantHues[hue].brightness)
			);
		button.hue = hue;
		button.saturation = dominantHues[hue].saturation;
		button.brightness = dominantHues[hue].brightness;
		//fill(hue, dominantHues[hue].saturation, dominantHues[hue].brightness);
		//ellipse(width/3 + i*width/20, height*3/4, 30, 30);
		i++;
		buttons.push(button)
	}
	// uncomment
	sendMsg('giveColor', colors.toString(), null);

	if(buttons.length >= 6) buttonTranslateX = (1-buttons[5].pos.x/width)/2 * width;
	else buttonTranslateX = (1-buttons[buttons.length-1].pos.x/width)/2 * width;
	screenInitialTranslateX = (width-img.width)/2;
	screenTotalTranslateX = screenInitialTranslateX;
	screenInitialTranslateY = height/10;
	screenTotalTranslateY = screenInitialTranslateY;
	finishedSetup = true;
	noLoop();
} // end setupImage

function draw(){
	colorMode(RGB, 255);
	background(126,176,229);
	colorMode(HSL, hueRange);
	//image(pgDrawing, 0, 0, pgDrawing.width, pgDrawing.height);
	if(img) setupImage(img);
	push();
		translate(screenTotalTranslateX, screenTotalTranslateY);
		scale(screenScale, screenScale)
		push();
	        translate(poopTranslateX, poopTranslateY);
	        for (var i = 0; i < poop.length; i++) {
			    var C = poop[i];
			    C.display();
			}
	    pop();
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
	buttonZoomIn.display();
	buttonZoomOut.display();
	//image(imgZoomIn, width*0.9, height*0.9, width*0.04, width*0.04)
	//image(imgZoomOut, width*0.95, height*0.9, width*0.04, width*0.04)
}
function touchStarted(){
	//console.log('touchStarted')
	mouseStartX = mouseX;
	mouseStartY = mouseY;
	loop();
	//console.log('mouseStartX ' + mouseStartX)
	//console.log('screenCurrentTranslateX ' + screenCurrentTranslateX)
  //mouseClicked()
}
function mouseClicked() {
	//console.log('mouseClicked')
	for (var i = 0; i < buttons.length; i++) {
	    var button = buttons[i];
	    if(button.pressed(mouseX - buttonTranslateX, mouseY)){
	    	//console.log(button)
	    	//console.log('pressed ' + i)
	    	var hue = button.hue;
	    	//var hue = Object.keys(dominantHues)[i];
	    	//if(dominantHues[hue] == undefined) debugger;
	    	if(dominantHues[hue].indices == undefined &&
	    		dominantHues[hue].diffBrightnessIndices == undefined) continue;
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
	    	draw();
	    } // end button pressed
	}
	if(buttonZoomIn.pressed(mouseX, mouseY)){
		getScreenCenter();
		screenScale += 0.1;
		panTo(screenCenterX, screenCenterY);
		draw();
	}
	if(buttonZoomOut.pressed(mouseX, mouseY)){
		getScreenCenter();
		screenScale -= 0.1;
		if(screenScale <= 0.1) screenScale = 0.1;
		panTo(screenCenterX, screenCenterY);
		draw();
	}
} // end mouseClicked
mouseStartX = 0;
mouseStartY = 0;
function touchMoved(){
  mouseDragged()
}
function mouseDragged() {
	screenCurrentTranslateX = (mouseX - mouseStartX)*screenTranslateScale;
	screenTotalTranslateX = screenInitialTranslateX + screenCurrentTranslateX;

	if(screenTotalTranslateX < (-img.width+side/2)*screenScale)
		screenCurrentTranslateX = (-img.width+side/2)*screenScale
								-screenInitialTranslateX;
	if(screenTotalTranslateX > (width-side*screenScale)) //-img.width*screenScale
		screenCurrentTranslateX =
			(width-side*screenScale) - screenInitialTranslateX;
	screenTotalTranslateX = screenInitialTranslateX + screenCurrentTranslateX;

	screenCurrentTranslateY = (mouseY - mouseStartY)*screenTranslateScale;
	screenTotalTranslateY = screenInitialTranslateY + screenCurrentTranslateY;

	if(screenTotalTranslateY < (-img.height+side/2)*screenScale)
		screenCurrentTranslateY = (-img.height+side/2)*screenScale - screenInitialTranslateY;
	
	if(screenTotalTranslateY > (height-side*screenScale)) //+(img.height+side*2)*0*screenScale)
		screenCurrentTranslateY = (height-side*screenScale) - screenInitialTranslateY;
	screenTotalTranslateY = screenInitialTranslateY + screenCurrentTranslateY;
	draw();
}
function getScreenCenter(){
	var screenLeft = -screenTotalTranslateX/screenScale;
	var screenRight = (-screenTotalTranslateX + width)/screenScale;
	var screenTop = -screenTotalTranslateY/screenScale;
	var screenBot = (-screenTotalTranslateY + height)/screenScale;
	screenCenterX = (screenLeft + screenRight) / 2;
	screenCenterY = (screenTop + screenBot) / 2;
}
function panTo(x, y){
	screenTotalTranslateX = -(x - width/2 / screenScale) * screenScale;
    screenTotalTranslateY = -(y - height/2 / screenScale) * screenScale;
    screenCurrentTranslateX = 0;
    screenInitialTranslateX = screenTotalTranslateX;
    screenCurrentTranslateY = 0;
    screenInitialTranslateY = screenTotalTranslateY;
}
function touchEnded(){
  mouseReleased()
}
function mouseReleased() {
	//console.log('screenInitialTranslateX ' + screenInitialTranslateX)
	screenInitialTranslateX += screenCurrentTranslateX;
	screenInitialTranslateY += screenCurrentTranslateY;
	screenCurrentTranslateX = 0;
	screenCurrentTranslateY = 0;
	released = true;
	newTouch = true;
	noLoop();
}

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
      			if(poopList[hsb.h] == undefined){
      				poopList[hsb.h] = {};
      				for(var m = 0; m < brightRange; m++){
      					poopList[hsb.h]['bright' + m] = [];
      				}
      			}
      			var n = Math.floor(hsb.b / (hueRange/brightRange))
      			if(n == brightRange) n -= 1;
      			poopList[hsb.h]['bright' + n].push(poop.length);
      			if(dominantHues[hsb.h].indices == undefined) dominantHues[hsb.h].indices = [];
      			dominantHues[hsb.h].indices.push(poop.length);
      		}else{
      			//console.log("Dominant Hues, Diff Brightness: " + hsb.h + ", " + (hsb.b-dominantHues[hsb.h].brightness))
      			var C1 = new Square(x, y, w, hsb.h, hsb.s, hsb.b);
      			//debugger;
      			//var C1 = new Square(x, y, w, hsb.h,
      			//	dominantHues[hsb.h].saturation, dominantHues[hsb.h].brightness);
      			if(poopList[hsb.h] == undefined){
      				poopList[hsb.h] = {};
      				for(var m = 0; m < brightRange; m++){
      					poopList[hsb.h]['bright' + m] = [];
      				}
      			}
      			var n = Math.floor(hsb.b / (hueRange/brightRange))
      			if(n == brightRange) n -= 1;
      			poopList[hsb.h]['bright' + n].push(poop.length);
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
      		console.log("not dominant Hues: " + hsb.h + ", becomes " + lastHueIndex)
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
var takeImage = function(receiveData){
	img = loadImage(receiveData);
}
var sendMsg = function(targetFunc, sendData, receiveCallback){
	//centerText("send Msg", width/2, height*1/4);
	webViewBridge.send(
	    targetFunc,
	    {mydata: sendData},
	    receiveCallback,
	    function(){
	      //console.log('error')
	  	}
	);
} // end sendMsg