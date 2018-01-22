var bunnyImage;
var sendButton;
function preload() {
	bunnyImage = loadImage("./../assets/bunny.png");
}

function setup() {
  window.scrollTo(0,1);
  document.body.style.overflow = 'hidden';
  createCanvas(window.innerWidth, window.innerHeight);
  background(255);
  image(bunnyImage, width/2, height/2, width/10, width/10);
  sendButton = new Button("send")
  sendButton.init(width*0.8, height*0.8, width/20)
  sendButton.display()
  if(cat != undefined) centerText(cat, width/2, height*3/4);
} // end setup

function touchEnded(){
  mouseReleased()
  if(sendButton.pressed()){
  }
}
function mouseReleased() {
}

var sendMsg = function(data){
  centerText("send Msg", width/2, height/2);
    webViewBridge.send(
        'sayHi',
        {mydata: data},
        function(dataBack){
            centerText("receive back", width/2, height/2);
            centerText(dataBack, width/4, height*3/4);
        },
        function(){
          //console.log('error')
      	}
    );
} // end sendMsg