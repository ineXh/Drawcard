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