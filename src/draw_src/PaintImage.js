var bunnyImage;
var urlImage;
var sendButton;
var imgScale;
var array;
function preload() {
	//bunnyImage = loadImage("./../assets/bunny.png");
	urlImage = loadImage("./../assets/mona.jpg");

}

function setup() {
  window.scrollTo(0,1);
  document.body.style.overflow = 'hidden';
  createCanvas(window.innerWidth, window.innerHeight);
  background(255);
  imgHeight = height/2;
  imgScale = imgHeight/urlImage.height;//1.2;//height/img.height
  array = zeros([urlImage.width, urlImage.height]);
  refresh()
  imageMode(CORNER);
  sendMsg('getDataUrl');

} // end setup
function draw(){
	//background(255);
	//if(!urlImage) centerText("loading", width/2, height*2/4);
	if(!urlImage) return;
	imgWidth = urlImage.width*imgScale;
	imgHeight = height/2;//width/urlImage.width*urlImage.height;
	image(urlImage, 0, imgHeight, imgWidth, imgHeight);
	//if(urlImage) image(urlImage, 0, 0, urlImage.width*imgScale, urlImage.height*imgScale);
	if(pen < 3) paintImage(urlImage);
	else paintImage2(urlImage);
}
var pX = 0;
var pY = 0;
var pen = 0;
var inc = 15;
var penCount = 0;
var mod = 400;
function paintImage2(img){
	for (var pY = 0; pY < img.height; pY++) {
    	for (var pX = 0; pX < img.width; pX++) {
    		if(array[pX][pY] == 1) continue;
      		var odds = getRandomInt(0, 20000);
	    	if (odds < 1) {
		      	x = pX*imgScale;
		  		y = pY*imgScale;
		      	paintPixel(img, x, y, pX, pY)
		      	penCount++;
		      	if(penCount%mod == 0){ pen++; mod += 50; penCount = 0;}
	      	}
	    }
  	}
}
function paintImage(img) {
  x = Math.floor(pX*imgScale);
  y = Math.floor(pY*imgScale);

  paintPixel(img, x, y, pX, pY)

  pX += Math.floor(img.width/inc);
  if(pX >= img.width){
    pX = 0;
    pY += Math.floor(img.height/inc);
  }
  if(pY >= img.height){
    pX = 0;
    pY = 0;
    refresh()
    console.log("Done " + pen);
    //inc = inc*1.5;
    pen++;
  }
} // end paintImage
var paintPixel = function(img, x, y, pX, pY){
	var pixelColor = img.get(pX, pY);
	pixelColor = color(red(pixelColor), green(pixelColor), blue(pixelColor), 100);
	array[pX][pY] = 1;
	push();
	    translate(x, y);
	    rotate(radians(random(45, 60)));
	    if(pen == 0) paintStroke(random(250, 350), pixelColor, getRandomInt(20, 40));
	    if(pen == 1) paintStroke(random(75, 125), pixelColor, getRandomInt(18, 22));
	    if(pen == 2) paintStroke(random(30, 60), pixelColor, getRandomInt(14, 18));
	    if(pen == 3) paintStroke(random(10, 25), pixelColor, getRandomInt(5, 12));
	    if(pen >= 4) paintStroke(random(5, 15), pixelColor, getRandomInt(4, 8));
  	pop();
} // end paintPixel

function refresh(){
  clr = color(getRandomInt(0,255), getRandomInt(0,255), getRandomInt(0,255));
  odds_tangent = random(0, 1)
  tangent1_factor = random(0, 0);
  tangent2_factor = random(-1, 1)*0.25;

  offsets.length = 0;
  alphas.length = 0;
  strokeWeights.length = 0;
  strokeThickness = 20;
  for (var num = 0; num < strokeThickness; num ++) {
    var offset = random(-50, 25);
    offsets.push(offset)
    alphas.push(random(100, 255));
    strokeWeights.push(getRandomInt(2,3));
  }
} // end refresh


var released = true;
var newTouch = true;
function touchStarted(){
  mouseClicked()
}
function mouseClicked() {
	var pixelColor = urlImage.get(mouseX/imgScale, mouseY/imgScale);
	clr = color(red(pixelColor), green(pixelColor), blue(pixelColor), 100);
}
function touchEnded(){
  mouseReleased()
  /*if(sendButton.pressed()){
  	sendButton.display()
  	sendMsg('getDataUrl');
  }*/
}
function mouseReleased() {
	released = true;
	newTouch = true;
}

function touchMoved(){
  mouseDragged()
}
var direction = new PVector(0,0);
var count = 0;
function mouseDragged() {
  count++;
  strokeThickness = 20

  if(released){
    length = 0;
    theta = 0;
    released = false;
  }else{
    direction.x = mouseX - pmouseX;
    direction.y = mouseY - pmouseY;
    theta = direction.heading() + PI/2
    length = newTouch? direction.mag()*1 : direction.mag()*6;//10
    newTouch = false
  }

  push();
        translate(mouseX, mouseY);
        rotate(theta)
        paintStroke(length, clr, 20);
  pop();

  pmouseX = mouseX
  pmouseY = mouseY

  return false;
} // end mouseMoved

var sendMsg = function(targetFunc, sendData){
	//centerText("send Msg", width/2, height*1/4);
	webViewBridge.send(
	    targetFunc,
	    {mydata: sendData},
	    function(receiveData){
	        //centerText("receive back", width/2, height/2);
	        //centerText(receiveData, width/4, height*8/10);
	        urlImage = loadImage(receiveData);
	    },
	    function(){
	      //console.log('error')
	  	}
	);
} // end sendMsg