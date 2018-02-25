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
var spliceOne = function(arr, index) {
  var len=arr.length;
  if (!len) { return }
  while (index<len) {
    arr[index] = arr[index+1]; index++ }
  arr.length--;
};

var dominantHue;
var dominantHueGreater5 = false;
var dominantHueEdge = false;
var hueRange = 360;
var brightRange = 4;
var maxHueChoice = 10;
var dominantSaturation;
var dominantBrightness;
var dominantHues = {};
//var dominantSatuations = {};
//var dominantBrightnesses = {};
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
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    gHue = h;
    gSat = s;
    gBright = l;
    return [h, s, l];
}
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
function extractColorFromImageEdge(img) {
  var hsb1 = extractColorFromImageXY(img, 0, 0, 1, 1, constants.ExtractImageType.Section);
  var hsb2 = extractColorFromImageXY(img, img.width-1, 0, img.width, 1, constants.ExtractImageType.Section);
  if(dominantHue == hsb1.h && dominantHue == hsb2.h) dominantHueEdge = true
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
      a = img.pixels[index+3]
      var arrHSL = rgbToHsl(r, g, b); //RGBtoHSB

      var HUE = Math.ceil(arrHSL[0]*hueRange); //Math.ceil(gHue*255);
      if(HUE == 0 && a == 0) HUE = -1; // Blank space
      var SAT = gSat*hueRange;
      var BRIGHT = gBright*hueRange;
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
      for(var i = arr.length-1;
        i >= 0
        && i > arr.length-(maxHueChoice+1)
        ; i--){
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
  //debugger;
  var hsb = new ColorHSB(HUE,
    saturations[HUE] / hueCount, brightnesses[HUE] / hueCount);

  return hsb;
}