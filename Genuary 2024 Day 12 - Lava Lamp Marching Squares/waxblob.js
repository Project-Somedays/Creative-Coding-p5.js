class Waxblob{
    constructor(){
        this.p = createVector(random(width), random(height));
        this.v = p5.Vector.random2D().setMag(2);
        this.r = random(s/4, s);
    }
    
    update(){
        if(this.p.x > width || this.p.x < 0){
            this.v.x = -this.v.x;
        };
        if(this.p.y > height || this.p.y < 0){
            this.v.y = -this.v.y;
        }
        this.p.add(this.v);
    }

    show(){
        circle(this.p.x, this.p.y, this.r);
    }
}