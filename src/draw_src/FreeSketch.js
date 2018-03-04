var testButton;
var url;
var dataURL = null;
var screenShots = [];
//var img = null;
function exportImg(){
  centerText("exportImg", width/2, height/2);
  var canvas = document.getElementById('defaultCanvas0');

  var dataURL = canvas.toDataURL('image/jpeg', 1.0);

  sendMsg(dataURL)
}
var clearImage = function(){
  //background(color(getRandomInt(0,255), getRandomInt(0,255), getRandomInt(0,255)));
  background(255);
}
var changeColor = function(input){
  //centerText("changeColor", width/2, height/2);
  var array = JSON.parse("[" + input + "]");
  //centerText(array[0], width/2, height*3/4);
  //centerText(array[1], width/2, height*0.85);
  clr = color(array[0], array[1], array[2]);
}
var changeStroke = function(input){
  //centerText("changeStroke", width/2, height/2);
  //centerText(input, width/2, height*3/4);
  offsets.length = 0;
  alphas.length = 0;
  strokeWeights.length = 0;
  strokeThickness = parseInt(input);
  for (var num = 0; num < strokeThickness; num ++) {
    var offset = random(-50, 25);
    offsets.push(offset)
    alphas.push(random(100, 255));
    strokeWeights.push(getRandomInt(2,3));
  }
}
var pressUndo = function(){
  undoPressed = true
  if(screenShots.length >= 2){
    dataURL = screenShots[screenShots.length-2]
    //screenShots.pop()
  }else{
    clearImage();
  }
}
var pressRedo = function(){
  redoPressed = true
  if(screenShots.length >= 2){
    dataURL = screenShots[screenShots.length-2]
    //screenShots.pop()
  }else{
    clearImage();
  }
}
var screenshot = function(input){
  //centerText("screenshot", width/2, height/4);
  var canvas = document.getElementById('defaultCanvas0');
  URL = canvas.toDataURL('image/jpeg', 1.0);
  screenShots.push(URL)
}
var sendMsg = function(data){
  centerText("send Msg", width/2, height/2);
    webViewBridge.send(
        'sayHi',
        {mydata: data}, //'test data'
        function(){

        },
        function(){
          //console.log('error')
        });
}
function preload() {
  img = loadImage("./../assets/whole.png");
}

function setup() {
  window.scrollTo(0,1);
  document.body.style.overflow = 'hidden';

  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(fr);
  refresh();
  clr = color(0, 0, 0);
  changeStroke(15);
  background(255);

} // end setup

function setupImage(data){
  //console.log('setupImage')
  centerText("setupImage", width/2, height/2);
  img = null;
  img = loadImage(data);
  //image(img, 0, 0, img.width, img.height);
  dataURL = null;
  drawn = false;
}
var drawn = true;
var undoPressed = false;
var redoPressed = false;
function drawImage(){
  //console.log('drawImage')
  centerText("drawImage", width/2, height*0.9);
  drawn = true;
  //console.log(img.width)
  image(img, 0, 0, width, height);
  undoPressed = false;
  redoPressed = false;
}
function draw(){
  if((undoPressed || redoPressed) && dataURL) setupImage(dataURL);
  if(!drawn && img.width > 1) drawImage();
}
function refresh(){
  count = 0;
  newTouch = true;
  clr = color(getRandomInt(0,255), getRandomInt(0,255), getRandomInt(0,255));

  odds_tangent = 0.1;//random(0, 1)

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
}
var x= 0
var y= 0
var pX = 0;
var pY = 0;

function touchStarted(){
  mouseClicked()
}
var clickCount = 0;
function mouseClicked() {
  if(!released){
    released = true;
    return;
  } 
  //console.log('mouse clicked')
  clickCount++;
  //centerText("mouse clicked " + clickCount, width/2, height/2);
  //refresh();
  
  released = false;
  push();
        translate(mouseX, mouseY);
        rotate(radians(0));
  pop();
}
function touchMoved(){
  mouseDragged()
}
var direction = new PVector(0,0);
var count = 0;
function mouseDragged() {
  count++;
  //strokeThickness = 20

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
        paintStroke(length, clr, strokeThickness);
  pop();

  pmouseX = mouseX
  pmouseY = mouseY

  return false;
} // end mouseMoved

function mouseMoved() {
  return false;
}
function touchEnded(){
  mouseReleased()
}
function mouseReleased() {
  //console.log('released')
  centerText("mouse released " + clickCount, width/2, height/2);
  screenshot();
  released = true;
  newTouch = true;
}
