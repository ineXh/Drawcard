var img;
var pgDrawing;
var urlImage;
var sendButton;
var poop = [];
var mult = 4;
var side = 2.5*mult;
var outWidth = 128*mult;
var outHeight = 128*mult;
var hsb;

function preload() {
	img = loadImage("./../assets/10.png");

		//size(img.width*2, img.height);
}

function setup() {
  window.scrollTo(0,1);
  document.body.style.overflow = 'hidden';
  createCanvas(window.innerWidth, window.innerHeight);
  background(255);
  imageMode(CORNER);
  ellipseMode(CORNER);
  colorMode(HSB, 255);

  //console.log("image width " + img.width + " image height " + img.height);
	if(img.width > img.height){
		img.resize(outWidth,0);
	}else{
		img.resize(0, outHeight);
	}
	img.loadPixels()

	hsb = extractColorFromImage(img);
	dominantHue = hsb.h;
	dominantSaturation = hsb.s;
	dominantBrightness = hsb.b;
	pgDrawing = createGraphics(width, height);
	//pgDrawing.beginDraw();
	//pgDrawing.background(200);
	pgDrawing.ellipseMode(CORNER);
	pgDrawing.stroke(0);
	pgDrawing.strokeWeight(1);
	pgDrawing.noStroke();
	pgDrawing.colorMode(HSB, 255);
	//pgDrawing.fill(30, 0.94*255, 0.98*255)
	//pgDrawing.fill(37, 0.0588*255, 238)
	//pgDrawing.ellipse(30, 30, 60, 60);
	drawImage();
	colorMode(HSB, 255);
	var i = 0;
	for(hue in dominantHues){
		fill(hue, dominantHues[hue].saturation, dominantHues[hue].brightness);
		ellipse(width/3 + i*width/20, height*3/4, 30, 30);
		i++;
	}
	/*for(var i = 0; i < dominantHues.length-1; i++){
		fill(dominantHues[i], dominantSatuations[i], dominantBrightnesses[i]);
		ellipse(width/3 + i*width/20, height*3/4, 30, 30);
	}*/
	//pgDrawing.dispose();
	//pgDrawing.endDraw();
} // end setup

function draw(){
	//background(255);
	//image(pgDrawing, mouseX-30, mouseY-30);
	image(pgDrawing, 0, 0);
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
      var hsb = extractColorFromImageXY(img, Math.floor(x), Math.floor(y),
      										 Math.ceil(x+w), Math.ceil(y+h), constants.ExtractImageType.Section);

      if(hsb.h != dominantHue){
      	//debugger;
        var C1 = new Square(x, y, w, hsb.h, hsb.s, hsb.b);
        poop.push(C1);
      }
    }
  }
  for (var i = 0; i < poop.length-1; i++) {
    var C = poop[i];
    C.display();
  }
} // end drawImage