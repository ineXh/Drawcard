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
  for (var num = 0; num < strokeThickness; num ++) {
    offset = offsets[num];
    alpha = alphas[num];
    sw = strokeWeights[num];
    var offset = random(-50, 25);
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