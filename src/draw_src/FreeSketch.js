var testButton;
var url;
var dataURL = null;

//var img = null;
function exportImg(){
  var canvas = document.getElementById('defaultCanvas0');
  var dataURL = canvas.toDataURL('image/jpeg', 1.0);
  sendMsg('receiveImage', dataURL, null);
  centerText("exportImg", width/2, height/2);
}
var clearImage = function(){
  console.log('clearImage')
  //background(color(getRandomInt(0,255), getRandomInt(0,255), getRandomInt(0,255)));
  background(255);
}
var changeColor = function(input){
  centerText("changeColor", width/2, height/2);
  var array = JSON.parse("[" + input + "]");
  //centerText(array[0], width/2, height*3/4);
  //centerText(array[1], width/2, height*0.85);
  // clr = color(array[0], array[1], array[2]);
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
var past = [];
var future = [];
var notSpliced = true;

var pressUndo = function(){
  //console.log('pressUndo')
  undoPressed = true

  if(past.length == 0) return;
  if(past.length == 1 && notSpliced){
    clearImage();
    dataURL = null;
    undoPressed = false;
    future.push(past.pop());
    return;
  }
  future.push(past.pop());
  dataURL = past[past.length-1];
}
var pressRedo = function(){
  //console.log('pressRedo')
  redoPressed = true
  if(future.length < 1) return;
  dataURL = future.pop();
  past.push(dataURL);
}
var screenshot = function(input){
  //centerText("screenshot", width/2, height/4);
  var canvas = document.getElementById('defaultCanvas0');
  URL = canvas.toDataURL('image/jpeg', 1.0);
  past.push(URL)
  if(past.length > 5){
    notSpliced = false;
    past.splice(0, 1);
  }
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
function preload() {
  img = loadImage("./../assets/whole.png");
}

function setup() {
  window.scrollTo(0,1);
  document.body.style.overflow = 'hidden';

  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(fr);
  imageMode(CENTER);
  refresh();
  clr = color(255, 0, 0);
  changeStroke(15);
  background(255);


} // end setup

function setupImage(data){
  //console.log('setupImage')
  //centerText("setupImage", width/2, height/2);
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
  //centerText("drawImage", width/2, height*0.9);
  drawn = true;
  //console.log(img.width)
  image(img, width/2, height/2, width, height);
  undoPressed = false;
  redoPressed = false;
}
function draw(){
  if((undoPressed || redoPressed) && dataURL) setupImage(dataURL);
  if(!drawn && img.width > 1) drawImage();
}
function refresh(){
  // console.log('refresh')
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
  // console.log('mouse clicked')
  clickCount++;
  future.length = 0;
  //centerText("mouse clicked " + clickCount, width/2, height/2);
  refresh();

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
  //centerText("mouse released " + clickCount, width/2, height/2);
  screenshot();
  released = true;
  newTouch = true;
}

function keyPressed() {
  if(key == 'Z') pressUndo()
    if(key == 'X') pressRedo()
      // if(key == 'q') screenshot()
}