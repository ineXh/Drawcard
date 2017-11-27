//var scribble = new Scribble();              // global mode
var boundaries = [];


function preload() {
  loadAssets();
  //img.loadPixels()
}
var imgScale;
function setup() {
  window.scrollTo(0,1);
  document.body.style.overflow = 'hidden';

  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(fr);
  refresh();
  imgScale = 1.2;//height/img.height
  //image(img, 0, 0);// img.width*imgScale, height);
  //image(img, 0, 0, img.width*imgScale, img.height*imgScale);
  /*var clr = img.get(256, 406);
  //image(clr, width/20, 0)
  //noStroke();
  fill(clr)
  rect(25, 25, 50, 50);*/
  //debugger;

  //userInterface = new UserInterface();
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
function draw1() {
  //image(img, 0, 0, img.width*imgScale, height);
  //x = (index2-1)%(img.width)*imgScale
  //y = Math.floor(index2/(img.width))*imgScale
  //index2 += Math.floor(512/24/(pen+1));
  pX += img.width/20;
  x = pX*imgScale;
  if(pX > img.width){
    pX -= img.width;
    pY += img.height/20;
  }
  y = pY*imgScale;

  //for (var y = 0; y < img.height; y++) {
    //for (var x = 0; x < img.width; x++) {
      var pixelColor = img.get(x/imgScale,y/imgScale);
      if(pixelColor == undefined){
          img.loadPixels()
          var pixelColor = img.pixels[index2];
        }
        if(first == 0 & pixelColor[0] != 0) first = index2
      pixelColor = color(red(pixelColor), green(pixelColor), blue(pixelColor), 100);
      push();
        translate(x, y);
        rotate(radians(random(45, 60)));
        if(pen == 0) paintStroke(random(150, 250), pixelColor, getRandomInt(20, 40));
        if(pen == 1) paintStroke(random(75, 125), pixelColor, getRandomInt(8, 12));
        if(pen == 2) paintStroke(random(30, 60), pixelColor, getRandomInt(1, 4));
        if(pen == 3) paintStroke(random(5, 20), pixelColor, getRandomInt(5, 15));
        if(pen >= 4) paintStroke(random(1, 10), pixelColor, getRandomInt(1, 7));
      pop();
  //  }
  //}
  //if (index2 > img.width*img.height) {
  //if (index2 > img.width*img.height) {
    if(pY > img.height){
    index2 = first;
    pX = 0;
    pY = 0;
    pen++;
    refresh()
    console.log("Done");
    //noLoop();
  }
} // end draw1

function draw0() {
  //background(255, 204, 0);
  //image(img, 0, 0);
  //translate(width/2, height/2);

  var index = 0;
  //println(frameCount);
  for (var y = 0; y < img.height; y++) {
    for (var x = 0; x < img.width; x++) {
      var odds = getRandomInt(0, 20000);
      //int odds = (int)random(2000);

      if (odds < 1) {
        //println("odds " + odds);
        //println("odds < 1");
        //println("x: " + x + " y: " + y);
        var pixelColor = img.get(x,y);
        //console.log(pixelColor)
        //img.pixels[index];
        //console.log(index);
        if(pixelColor == undefined){
          img.loadPixels()
          var pixelColor = img.pixels[index];
        }
        //debugger;
        //println(pixelColor);
        pixelColor = color(red(pixelColor), green(pixelColor), blue(pixelColor), 100);
        //console.log(red(pixelColor) + ", " + green(pixelColor) + ", " + blue(pixelColor));
        push();
        //translate(x-img.width/2, y-img.height/2);
        translate(x, y);
        rotate(radians(random(-90, 90)));
        //rotate(radians(random(0, 45)));
        //println(frameCount);
        // Paint by layers from rough strokes to finer details
        if (frameCount < 20) {
          // Big rough strokes
          paintStroke(random(150, 250), pixelColor, getRandomInt(20, 40));
        } else if (frameCount < 50) {
          // Thick strokes
          paintStroke(random(75, 125), pixelColor, getRandomInt(8, 12));
        } else if (frameCount < 300) {
          // Small strokes
          paintStroke(random(30, 60), pixelColor, getRandomInt(1, 4));
        } else if (frameCount < 350) {
          // Big dots
          paintStroke(random(5, 20), pixelColor, getRandomInt(5, 15));
        } else if (frameCount < 1200) {
          // Small dots
          paintStroke(random(1, 10), pixelColor, getRandomInt(1, 7));
        }

        pop();
      } // end if (odds < 1)

      index += 1;
    }

  }

  if (frameCount > 601) {
    console.log("Done");
    noLoop();
  }

} // end draw

function touchStarted(){
  mouseClicked()
}
function mouseClicked() {
  //console.log('mouse clicked')
  refresh();
  released = false;
  // clr = color(204, 102, 0);
  /*console.log('mouseX ' + mouseX)
  fill(255,0,0)
  ellipse(mouseX, mouseY, 100, 100);
  return false;*/
  //clr = color(getRandomInt(0,255), getRandomInt(0,255), getRandomInt(0,255));
  push();
        //translate(x-img.width/2, y-img.height/2);
        translate(mouseX, mouseY);
        //rotate(radians(random(-1, 1)));
        rotate(radians(0));
        //paintStroke(random(150, 250), clr, getRandomInt(20, 40));
        //paintStroke(random(150, 250), clr, 20);
        //paintStroke(300, clr, 20);
  pop();
}
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


  /*noFill();
  stroke(clr);
  strokeWeight(strokeThickness);
  //line(pmouseX, pmouseY, mouseX, mouseY)



  var z = 1;
  // Draw stroke's details
  for (var num = strokeThickness; num > 0; num --) {
    var offset = random(-50, 25);
    var newColor = color(red(clr)+offset, green(clr)+offset, blue(clr)+offset, random(100, 255));

    stroke(newColor);
    strokeWeight(getRandomInt(0,3));
    //curve(tangent1, -stepLength*2, z-strokeThickness/2, -stepLength*random(0.9, 1.1), z-strokeThickness/2, stepLength*random(0.9, 1.1), tangent2, stepLength*2);
    //line(pmouseX, pmouseY, mouseX, mouseY)

    z += 1;
  }
  //fill(255,0,0)
  //ellipse(mouseX, mouseY, 25, 25);
  // prevent default
  */

  /*r = 10
  push();
    translate(mouseX, mouseY);
    rotate(theta);
    fill(255,0,0)
    beginShape();
    vertex(0, -r*2);
    vertex(-r, r*2);
    vertex(r, r*2);
    endShape(CLOSE);
  pop();*/

  pmouseX = mouseX
  pmouseY = mouseY

  return false;
} // end mouseMoved

function mouseMoved() {
  /*var clr = color(204, 102, 0);
  push();
        //translate(x-img.width/2, y-img.height/2);
        translate(mouseX, mouseY);
        rotate(radians(random(-1, 1)));
        //paintStroke(random(150, 250), clr, getRandomInt(20, 40));
        paintStroke(105, clr, getRandomInt(20, 40));
  pop();*/
  //fill(255,0,0)
  //ellipse(mouseX, mouseY, 25, 25);
  return false;
}
function touchEnded(){
  mouseReleased()
}
function mouseReleased() {
  released = true;
  newTouch = true;
}

var tangent1_factor = 0;
var tangent2_factor = 0;
var odds_tangent = 1;
var offsets = [];
var alphas = [];
var strokeWeights = [];
var paintStroke = function(strokeLength, strokeColor, strokeThickness) {
  var stepLength = strokeLength/4.0;

  // Determines if the stroke is curved. A straight line is 0.

  //var odds_tangent = random(1.0);
  //odds_tangent = random(0, 1)


  if (odds_tangent < 0.7) {
    //tangent1_factor = random(-1, 1);
    //tangent2_factor = random(-1, 1);
    tangent1 = tangent1_factor*strokeLength;//random(-strokeLength, strokeLength);
    tangent2 = tangent2_factor*strokeLength;//random(-strokeLength, strokeLength);
    //tangent1 = -strokeLength;
    //tangent2 = strokeLength;
  }else{
    tangent1 = 0;
    tangent2 = 0;
  }

  // Draw a big stroke
  noStroke()
  fill(255,0,0)
  //ellipse(tangent1, -stepLength*2, 25, 25)
  //ellipse(0, -stepLength, 25, 25)
  //ellipse(0, stepLength, 25, 25)
  noFill();
  stroke(strokeColor);
  strokeWeight(strokeThickness/2);

  curve(tangent1, -stepLength*2,
    0, -stepLength,
    0, stepLength,
     tangent2, stepLength*2);

  var z = 1;

  // Draw stroke's details
  //for (var num = strokeThickness; num > 0; num --) {
  for (var num = 0; num < strokeThickness; num ++) {
    offset = offsets[num];
    alpha = alphas[num];
    sw = strokeWeights[num];
    //var offset = random(-50, 25);
    var newColor = color(red(strokeColor)+offset, green(strokeColor)+offset, blue(strokeColor)+offset, alpha);

    stroke(newColor);
    //strokeWeight(getRandomInt(0,3));
    //strokeWeight(getRandomInt(2,3));
    strokeWeight(sw)
    curve(tangent1, -stepLength*2,
       z-strokeThickness/2, -stepLength*random(0.9, 1.1),
       z-strokeThickness/2, stepLength*random(0.9, 1.1),
       tangent2, stepLength*2);

    z += 1;
  }
}