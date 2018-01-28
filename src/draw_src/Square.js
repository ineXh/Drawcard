function Square(x, y, s, hue, sat, bright){
	this.create(x, y, s, hue, sat, bright);
}
Square.prototype = {
	create: function(x, y, s, hue, sat, bright){
		this.x = x;
		this.y = y;
		this.s = s;
		this.hue = hue;
		this.sat = sat;
		this.bright = bright;
	},
	draw: function(){
		pgDrawing.fill(this.hue, this.sat, this.bright);
    	//pgDrawing.rect(this.x, this.y, this.s, this.s);
    	pgDrawing.ellipse(this.x, this.y, this.s, this.s);
	},
	display: function(){
		fill(this.hue, this.sat, this.bright);
		ellipse(this.x, this.y, this.s, this.s);
	}
} // end Square