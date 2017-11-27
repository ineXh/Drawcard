var kernel = [[ -1, -1, -1],
                    [ -1,  9, -1],
                    [ -1, -1, -1]];

var img;
var edgeImg;
function preload() {
  img = loadImage("assets/cow_emoji.png"); // Load the original image
}
function setup() {
  createCanvas(640, 360);
  noLoop();
}

function draw() {
  image(img, 0, 0); // Displays the image from point (0,0)
  img.loadPixels();
  // Create an opaque image of the same size as the original
  edgeImg = createImage(img.width, img.height, RGB);
  // Loop through every pixel in the image.
  for (var y = 1; y < img.height-1; y++) { // Skip top and bottom edges
    for (var x = 1; x < img.width-1; x++) { // Skip left and right edges
      var sum = 0; // Kernel sum for this pixel
      for (var ky = -1; ky <= 1; ky++) {
        for (var kx = -1; kx <= 1; kx++) {
          // Calculate the adjacent pixel for this kernel point
          var pos = (y + ky)*img.width + (x + kx);
          // Image is grayscale, red/green/blue are identical
          var val = red(img.pixels[pos]);
          //var val = red(img.get(x, y))
          // Multiply adjacent pixels based on the kernel values
          sum += kernel[ky+1][kx+1] * val;
        }
      }
      // For this pixel in the new image, set the gray value
      // based on the sum from the kernel
      //edgeImg.pixels[y*img.width + x] = color(sum, sum, sum);
    }
  }
  // State that there are changes to edgeImg.pixels[]
  //edgeImg.updatePixels();
  image(edgeImg, width/2, 0); // Draw the new image
}
