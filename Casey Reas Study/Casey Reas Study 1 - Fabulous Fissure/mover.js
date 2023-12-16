class Mover{
	constructor(x, y, velX, velY, colour, r){
		this.pos = createVector(x,y);
		this.vel = createVector(velX, velY).normalize(); // additional control
		this.acc = createVector(0,0);
		// this.colour = random(colours);
		this.colour = colour;		
		this.r = r;
	}
	
	applyForce(f){
		this.acc.add(f);
	}
	
	update(){
		this.pos.add(this.vel);
		this.vel.add(this.acc);
		if(this.vel.mag() > 1){
			this.vel.setMag(1);
		}
		this.acc.mult(0);
		if(wrapMode){
            this.wrap();
        }
		if(bounceMode){
            this.bounce();
        }
	}
	
	wrap(){
		if(this.pos.x < 0){
			this.pos.x = width;
		}
		if(this.pos.x > width){
			this.pos.x = 0;
		}
		if(this.pos.y < 0){
			this.pos.y = height;
		}
		if(this.pos.y > height){
			this.pos.y = 0;
		}
	}
	
	bounce(){
		if(this.pos.x > width || this.pos.x < 0){
			this.vel.x = -this.vel.x;
		}
		if(this.pos.y > height || this.pos.y < 0){
			this.vel.y = -this.vel.y;
		}
	}
	
	show(){
		ellipse(this.pos.x, this.pos.y, 2*r, 2*r);
	}
}