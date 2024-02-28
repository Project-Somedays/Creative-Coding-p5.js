//Object to store the arc's information and method to draw it.
class Arch{
	constructor(x,y,r,a0,a1,h){
		this.x = x //center x
		this.y = y //center y
		this.r = r //radius of arc
		this.a0 = a0 //start angle
		this.a1 = a1 //end angle
		this.h = h //color hue
	}
	
	// Displays the arch object. Pass in the alpha for the color
	show(alpha){
		// When you press the mouse draw the strokes only
		if(mouseIsPressed){
			noFill()
			stroke(this.h,200,200,alpha)
		}
		// If mouse is not pressed then draw the arcs filled
		else{
			noStroke()
			fill(this.h,200,200,alpha)
		}
		//Draw the arc
		arc(this.x,this.y,this.r,this.r,this.a0,this.a1)
	}
}