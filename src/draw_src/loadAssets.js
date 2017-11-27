var scoreFont
var robotoFont
var moonBG
var imgCharacter1 = []
var imgBlow = []
var imgDust = []
var imgDmg = []
var imgPlay;
var imgGo;
var soundButton;
var img;
var imgIndex = 0;
var imgNames = ["assets/cow_emoji.png"]
//String[] imgNames = {"battlecruiser.jpg", "face.jpg", "egg.jpg"};

var loadAssets = function(){
	//img = loadImage(imgNames[imgIndex]);
	/*scoreFont = loadFont('assets/ataurusp.ttf');
	robotoFont = loadFont('assets/Roboto-Regular.ttf');
	moonBG = loadImage("assets/surface1.png");
	imgPlay = loadImage("assets/play_196.png");
	imgGo = loadImage("assets/go_196.png");
	for(var i = 1; i <= 2; i++) imgCharacter1[i-1] = loadImage("assets/1/" + i + ".png");
	for(var i = 0; i <= 4; i++) imgDust[i] = loadImage("assets/dust/" + i + ".png");
	for(var i = 1; i <= 7; i++) imgDmg[i-1] = loadImage("assets/dmg1/" + i + ".png");
	for(var i = 1; i <= 6; i++) imgBlow[i-1] = loadImage("assets/blow/" + i + ".png");

	soundButton = loadSound('assets/gamestart.wav');
	soundButton.setVolume(0.5);*/
	console.log('loaded')
} // end loadAssets