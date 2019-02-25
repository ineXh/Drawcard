function Square(x, y, s, hue, sat, bright, label){
	this.create(x, y, s, hue, sat, bright, label);
}
Square.prototype = {
	create: function(x, y, s, hue, sat, bright, label){
		this.x = x;
		this.y = y;
		this.s = s;
		this.hue = hue;
		this.sat = sat;
		this.bright = bright;
		this.label = label;
		this.hide = false;
	},
	draw: function(){
		pgDrawing.fill(this.hue, this.sat, this.bright);
    	//pgDrawing.rect(this.x, this.y, this.s, this.s);
    	pgDrawing.ellipse(this.x, this.y, this.s, this.s);
	},
	display: function(){
		if(this.hide) return;
		fill(this.hue, this.sat, this.bright);
		ellipse(this.x, this.y, this.s, this.s);
		//tint(this.hue, this.sat, this.bright);
		//image(imgCircle, this.x, this.y, this.s, this.s);
		fill(0);
		if(this.label != undefined) text(this.label, this.x, this.y+6);
	}
} // end Square