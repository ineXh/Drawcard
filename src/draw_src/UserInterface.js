function UserInterface(){
	this.create();
}
UserInterface.prototype = {
	create: function(){
		this.playButton = new Button()
		this.playButton.init(width/2, height*0.8, width/16, imgPlay);
		this.continueButton = new Button()
		this.continueButton.init(width/2, height*0.8, width/16, imgGo);
	},
	init: function(){
		switch(gameState){
			case constants.GameState.Title:
			break;
		}
	},
	update: function(){
		this.displayTitle();
		this.displayGetReady();
		this.displayGo();
		this.displayTime();
		this.displayScore();
	},
	pressed: function(){
		switch(gameState){
			case constants.GameState.Title:
				if(this.playButton.pressed()){
  					soundButton.play();
					stage = 1;
					gameState = constants.GameState.GetReady;
					gamePlay.init();
				}
			break;
			case constants.GameState.GetReady:
				gameState = constants.GameState.InPlay;
				soundButton.play();
				this.goCount = 0;
				this.score = 0;
			break;
			case constants.GameState.GameOver:
				if(this.continueButton.pressed()){
  					soundButton.play();
					stage++;
					gameState = constants.GameState.GetReady;
					gamePlay.init();
				}
			break;
		}
	}, // end pressed
	displayTitle: function(){
		if(gameState != constants.GameState.Title) return;
		fill('#ED225D');
		textAlign(CENTER);
		textFont(scoreFont);
		textSize(height/8);
		text('Cannon Fight', width/2, height*0.2);
		this.playButton.display();
	},
	displayGetReady: function(){
		if(gameState != constants.GameState.GetReady) return;
		fill('#ED225D');
		textAlign(CENTER);
		textFont(scoreFont);
		textSize(height/8);
		text('Stage ' + stage, width/2, height*0.2);
		text('Get Ready!', width/2, height*0.2 + height/8);
	},
	displayGo: function(){
		if(gameState != constants.GameState.InPlay) return;
		if(this.goCount > fr*2) return;
		this.goCount++;
		fill('#ED225D');
		textAlign(CENTER);
		textFont(scoreFont);
		textSize(height/8);
		text('Go!', width/2, height*0.2);
	},
	displayScore: function(){
		if(gameState != constants.GameState.GameOver) return;
		fill('#ED225D');
		textAlign(CENTER);
		textFont(scoreFont);
		textSize(height/8);
		text('You Win!', width/2, height*0.2);
		this.continueButton.display();
	},
	displayTime: function(){
		if(gameState != constants.GameState.InPlay && gameState != constants.GameState.GameOver) return;
		fill('#2f5eaa');
		noStroke()
		textAlign(CENTER);
		textFont(robotoFont);
		textSize(height/12);
		text('Time: ' + this.time, width*0.8, ground + height*0.1);
		text('Score: ' + this.score, width*0.8, height*0.1);
		if(count%fr == 0){
			this.time -= 1;
			if(this.time <= 0){
				this.time = 0
				gameState = constants.GameState.GameOver;
			}
		}
	}
} // end UserInterface