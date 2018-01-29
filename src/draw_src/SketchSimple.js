var bunnyImage;
var urlImage;
var sendButton;
function preload() {
	bunnyImage = loadImage("./../assets/bunny.png");
}

function setup() {
  window.scrollTo(0,1);
  document.body.style.overflow = 'hidden';
  createCanvas(window.innerWidth, window.innerHeight);
  background(255);
  imageMode(CORNER);
  sendMsg('getDataUrl');
  /*image(bunnyImage, width/2, height/2, width/10, width/10);
  sendButton = new Button()
  sendButton.init(constants.ButtonType.Label, width*0.8, height*0.8, width/20, "send")
  sendButton.display()
  if(cat != undefined) centerText(cat, width/2, height*3/4);*/
} // end setup
function draw(){
	background(255);
	//if(!urlImage) centerText("loading", width/2, height*2/4);
	if(urlImage) image(urlImage, 0, 0, width, width/urlImage.width*urlImage.height);
}
function touchEnded(){
  mouseReleased()
  if(sendButton.pressed()){
  	sendButton.display()
  	sendMsg('getDataUrl');
  }
}
function mouseReleased() {
}

var sendMsg = function(targetFunc, sendData){
	centerText("send Msg", width/2, height*1/4);
	webViewBridge.send(
	    targetFunc,
	    {mydata: sendData},
	    function(receiveData){
	        //centerText("receive back", width/2, height/2);
	        //centerText(receiveData, width/4, height*8/10);
	        urlImage = loadImage(receiveData);
	    },
	    function(){
	      //console.log('error')
	  	}
	);
} // end sendMsg