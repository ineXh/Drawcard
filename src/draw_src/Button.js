function Button(){
	this.create();
}
Button.prototype = {
	create: function(){
		this.pos = new PVector(0, 0)
	},
	init: function(buttonType, x, y, r, label, img, clr){
		this.buttonType = buttonType;
		this.pos.x = x;
		this.pos.y = y;
		this.r = r;
		this.label = label;
		this.img = img;
		this.clr = clr;
	},
	clean: function(){
		this.img = null;
	},
	pressed: function(x, y){
		if(x > this.pos.x - this.r && x < this.pos.x + this.r
		&& y > this.pos.y - this.r && y < this.pos.y + this.r){
			//console.log('pressed')
			return true
		}
		return false
	},
	display: function(){
		switch(this.buttonType){
			case constants.ButtonType.Label:
				this.displayLabel();
			break;
			case constants.ButtonType.Circle:
				this.displayCircle();
			break;
		}
	},
	displayCircle: function(){
		fill(this.clr);
		ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
	},
	displayLabel: function(){
		//fill(255,0,0)
		fill(getRandomInt(0,255), getRandomInt(0,255), getRandomInt(0,255))
		//ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
		centerText(this.label, this.pos.x, this.pos.y);
		//noTint();
		//imageMode(CENTER);
		//image(this.img, this.pos.x, this.pos.y, this.r*2, this.r*2);
	}
} // end Button