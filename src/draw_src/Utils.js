window.getRandomRange = function(min, max) {
  return Math.random() * (max - min) + min;
}
window.getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function centerText(t, x, y){
  fill(color(getRandomInt(0,255), getRandomInt(0,255), getRandomInt(0,255)));
  rectMode(CENTER);
  rect(x, y, width/2.5, height/20);
  fill(255);
  textAlign(CENTER);
  text(t, x, y);
}

function zeros(dimensions) {
    var array = [];

    for (var i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
    }

    return array;
}
function swap(json){
  var ret = {};
  for(var key in json){
    ret[json[key]] = key;
  }
  return ret;
}

var dominantHue;
var hueRange = 255;
var dominantSaturation;
var dominantBrightness;
var dominantHues = {};
var dominantSatuations = {};
var dominantBrightnesses = {};
function ColorHSB(h, s, b){
  this.create(h, s, b);
}
ColorHSB.prototype = {
  create: function(h, s, b){
    this.h = h;
    this.s = s;
    this.b = b;
  },
} // end ColorHSB
var gHue, gSat, gBright;
function RGBtoHSB(r, g, b) {
    var cmax = (r > g) ? r : g;
    if (b > cmax) cmax = b;
    var cmin = (r < g) ? r : g;
    if (b < cmin) cmin = b;

    gBright = cmax;
    //gBright = cmin;
    if (cmax != 0)
        gSat = ( (cmax - cmin)) / (cmax)*255;
    else
        gSat = 0;
    if (gSat == 0)
        gHue = 0;
    else {
        var redc = ( (cmax - r)) / ( (cmax - cmin));
        var greenc = ( (cmax - g)) / ( (cmax - cmin));
        var bluec = ( (cmax - b)) / ( (cmax - cmin));
        if (r == cmax)
            gHue = bluec - greenc;
        else if (g == cmax)
            gHue = 2.0 + redc - bluec;
        else
            gHue = 4.0 + greenc - redc;
        gHue = gHue / 6.0;
        if (gHue < 0)
            gHue = gHue + 1.0;
    }
}

function extractColorFromImage(img) {
  return extractColorFromImageXY(img, 0, 0, img.width, img.height, constants.ExtractImageType.Whole);
}
function extractColorFromImageXY(img, x1, y1, x2, y2, extractImageType) {
  //img.loadPixels();
  var numberOfPixels = img.pixels.length;
  var hues = {};
  var saturations = {};
  var brightnesses = {};

  //for (int i = 0; i < numberOfPixels; i++) {
  for(var y = y1; y < y2 && y < img.height; y++){
    //console.log('y ' + y);
    for(var x = x1; x < x2 && x < img.width; x++){
      //int pixel = img.pixels[i];
      //console.log('x ' + x);

      //var pixel = img.get(x, y);
      //RGBtoHSB(red(pixel), green(pixel), blue(pixel))
      index = x*4+y*4*img.width;
      r = img.pixels[index]
      g = img.pixels[index+1]
      b = img.pixels[index+2]
      RGBtoHSB(r, g, b);
      var HUE = Math.ceil(gHue*255);
      var SAT = gSat;
      var BRIGHT = gBright;
      if(hues[HUE] == undefined || isNaN(HUE)){
        hues[HUE] = 0;
        saturations[HUE] = 0;
        brightnesses[HUE] = 0;
      }
      hues[HUE]++;
      saturations[HUE] += SAT;
      brightnesses[HUE] += BRIGHT;
    }
  }
  switch(extractImageType){
    case constants.ExtractImageType.Whole:
      quickSort = new QuickSort();
      var swapped = swap(hues);
      var arr = Object.keys(swapped);
      quickSort.sort(arr, 0, arr.length-1);
      hueCount = arr[arr.length-1];
      HUE = parseInt(swapped[hueCount]);
      dominantHues = {}
      dominantSatuations = {}
      dominantBrightnesses = {}
      for(var i = arr.length-1; i > arr.length-11 && i >= 0; i--){
        var count = arr[i];
        var hueIndex = swapped[count];
        dominantHues[hueIndex] = {
          count:count,
          saturation: saturations[hueIndex] / count,
          brightness: brightnesses[hueIndex] / count
        }
        //dominantHues.push(hueIndex)
        //dominantSatuations.push(saturations[hueIndex] / count)
        //dominantBrightnesses.push(brightnesses[hueIndex] / count)
      }
      //debugger;
    break;
    case constants.ExtractImageType.Section:
    default:
    // Find the most common hue.
      var hueCount = hues[Object.keys(hues)[0]];
      var HUE = parseInt(Object.keys(hues)[0]);
      for(i in hues){
         if (hues[i] > hueCount) {
          hueCount = hues[i];
          HUE = parseInt(i);
        }
      }
    break;
  }

  var hsb = new ColorHSB(HUE,
    saturations[HUE] / hueCount, brightnesses[HUE] / hueCount);

  return hsb;
}