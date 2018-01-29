//var scribble = new Scribble();              // global mode
var boundaries = [];
var testButton;
var url;

function preload() {
  loadAssets();
  const URL = 'http:/' + '/www.Clker.com/cliparts/9/0/f/5/'
            + '1194986802274589086football_ball_brice_boye_01.svg.med.png';
}

var imgScale;
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
  //clr = img.get(mouseX/imgScale,mouseY/imgScale);

  //clr = img.get(mouseX,mouseY);
  //console.log(clr)
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


function touchMoved(){
  //mouseMoved()
  mouseDragged()
}
var direction = new PVector(0,0);
var count = 0;
function mouseDragged() {
  //console.log('mouseMoved')
  //var clr = color(204, 102, 0);
  count++;
  //if(count%4 > 0) return;
  //if(frameCount%4 > 0) return;
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

  //if(length > 200) length = 200
  push();
        //translate(x-img.width/2, y-img.height/2);
        translate(mouseX, mouseY);
        //rotate(radians(random(-1, 1)));
        rotate(theta)
        paintStroke(length, clr, 20);
        //paintStroke(300, clr, 20);
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

