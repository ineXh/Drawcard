function Button(){
	this.create();
}
Button.prototype = {
	create: function(){
		this.pos = new PVector(0, 0)
	},
	init: function(x, y, r, img){
		this.pos.x = x;
		this.pos.y = y;
		this.r = r;
		this.img = img;
	},
	clean: function(){
		this.img = null;
	},
	pressed: function(){
		if(mouseX > this.pos.x - this.r && mouseX < this.pos.x + this.r
		&& mouseY > this.pos.y - this.r && mouseY < this.pos.y + this.r){
			//console.log('pressed')
			return true
		}
		return false
	},
	display: function(){
		if(!this.img) return;
		noTint();
		imageMode(CENTER);
		image(this.img, this.pos.x, this.pos.y, this.r*2, this.r*2);
	}
} // end Button