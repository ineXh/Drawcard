window.getRandomRange = function(min, max) {
  return Math.random() * (max - min) + min;
}
window.getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}