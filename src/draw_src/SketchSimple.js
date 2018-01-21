var bunnyImage;
function preload() {
	bunnyImage = loadImage("./../assets/bunny.png");
}

function setup() {
  window.scrollTo(0,1);
  document.body.style.overflow = 'hidden';
  createCanvas(window.innerWidth, window.innerHeight);
  background(255);
  image(bunnyImage, width/2, height/2, width/10, width/10);
} // end setup