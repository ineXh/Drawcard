// All the paths
var paths = [];
// Are we painting?
var painting = false;
// How long until the next circle
var next = 0;
// Where are we now and where were we?
var current;
var previous;

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
  current = createVector(0,0);
  previous = createVector(0,0);


} // end setup
function draw() {
  background(200);

  // If it's time for a new point
  if (millis() > next && painting) {
    // Grab mouse position
    current.x = mouseX;
    current.y = mouseY;
    // New particle's force is based on mouse movement
    var force = p5.Vector.sub(current, previous);
    force.mult(0.05);

    // Add new particle
    paths[paths.length - 1].add(current, force);

    // Schedule next circle
    next = millis() + 1;//random(10);

    // Store mouse values
    previous.x = current.x;
    previous.y = current.y;
  }

  // Draw all paths
  for( var i = 0; i < paths.length; i++) {
    paths[i].update();
    paths[i].display();
  }
} // end draw

function refresh(){
  //console.log('refresh')
  count = 0;
  newTouch = true;
  clr = color(getRandomInt(0,255), getRandomInt(0,255), getRandomInt(0,255));
  odds_tangent = 0.1;

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
var x= 0
var y= 0
var pX = 0;
var pY = 0;


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
        //paintStroke(length, clr, 20);
  pop();
  pmouseX = mouseX
  pmouseY = mouseY
  return false;
} // end mouseMoved

function mouseMoved() {
  return false;
}
function touchStarted(){
  mouseClicked()
  mousePressed()
}
function mouseClicked() {
  //refresh();
}
function mousePressed() {
  next = 0;
  painting = true;
  previous.x = mouseX;
  previous.y = mouseY;
  paths.push(new Path());
}
function touchEnded(){
  mouseReleased()
}
function mouseReleased() {
  painting = false;
  released = true;
  newTouch = true;
}

// A Path is a list of particles
function Path() {
  this.particles = [];
  this.hue = random(100);
}

Path.prototype.add = function(position, force) {
  // Add a new particle with a position, force, and hue
  this.particles.push(new Particle(position, force, this.hue));
}

// Display plath
Path.prototype.update = function() {
  for (var i = 0; i < this.particles.length; i++) {
    this.particles[i].update();
  }
}

// Display plath
Path.prototype.display = function() {

  // Loop through backwards
  for (var i = this.particles.length - 1; i >= 0; i--) {
    // If we shold remove it
    if (this.particles[i].lifespan <= 0) {
      this.particles.splice(i, 1);
    // Otherwise, display it
    } else {
      this.particles[i].display(this.particles[i+1]);
    }
  }

}

// Particles along the path
function Particle(position, force, hue) {
  this.position = createVector(position.x, position.y);
  this.velocity = createVector(force.x, force.y);
  this.drag = 0.80;
  this.lifespan = 255;
}

Particle.prototype.update = function() {
  // Move it
  this.position.add(this.velocity);
  // Slow it down
  this.velocity.mult(this.drag);
  // Fade it out
  //this.lifespan--;
}

// Draw particle and connect it with a line
// Draw a line to another
Particle.prototype.display = function(other) {
  //stroke(0, this.lifespan);
  //fill(0, this.lifespan/2);
  
  // If we need to draw a line
  if (other) {
    direction.x = this.position.x - other.position.x;
    direction.y = this.position.y - other.position.y;
    theta = direction.heading() + PI/2
    length = direction.mag()*2
    push();
        translate((this.position.x + other.position.x) /2 , (this.position.y + other.position.y) /2);
        rotate(theta)
        paintStroke2(length, clr, 20);
    pop();
    //paintStroke2(this.position.x, this.position.y, other.position.x, other.position.y,
      //length, clr, 20);
    //line(this.position.x, this.position.y, other.position.x, other.position.y);
  }
  //ellipse(this.position.x,this.position.y, 24, 24);
}

var paintStroke2 = function(strokeLength, strokeColor, strokeThickness) {
  var stepLength = strokeLength/4.0;

  if (odds_tangent < 0.7) {
    tangent1 = tangent1_factor*strokeLength;//random(-strokeLength, strokeLength);
    tangent2 = tangent2_factor*strokeLength;//random(-strokeLength, strokeLength);
  }else{
    tangent1 = 0;
    tangent2 = 0;
  }
  tangent1 = 0;
    tangent2 = 0;
  // Draw a big stroke
  noStroke()
  fill(255,0,0)
  noFill();
  stroke(strokeColor);
  strokeWeight(strokeThickness/2);
  //line(x1, y1, x2, y2);
  curve(tangent1, -stepLength*2,
    0, -stepLength,
    0, stepLength,
     tangent2, stepLength*2);
  var z = 1;
  // Draw stroke's details
  for (var num = 0; num < strokeThickness; num ++) {
    offset = offsets[num];
    alpha = alphas[num];
    sw = strokeWeights[num];
    var offset = random(-50, 25);
    offset = 20;
    var newColor = color(red(strokeColor)+offset, green(strokeColor)+offset, blue(strokeColor)+offset, alpha);
    stroke(newColor);
    strokeWeight(sw)
    //line(x1, y1, x2, y2);
    curve(tangent1, -stepLength*2,
       z-strokeThickness/2, -stepLength,
       z-strokeThickness/2, stepLength,
       tangent2, stepLength*2);

    z += 1;
  }
}