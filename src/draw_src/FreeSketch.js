//var scribble = new Scribble();              // global mode
var boundaries = [];
var testButton;
var url;
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

}

function setup() {
  window.scrollTo(0,1);
  document.body.style.overflow = 'hidden';

  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(fr);
  refresh();
  background(255);

} // end setup
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
function mouseClicked() {
  //console.log('mouse clicked')
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

function mouseMoved() {
  return false;
}
function touchEnded(){
  mouseReleased()
}
function mouseReleased() {
  released = true;
  newTouch = true;
}
