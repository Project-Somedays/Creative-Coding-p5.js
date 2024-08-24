class Box{
    constructor(x,y,c, boxSize){
        this.initPos = {x: x, y: y};
        this.angle = 0;
        this.c = c;
        this.boxSize = boxSize;
        this.body = Bodies.rectangle(x,y,boxSize, boxSize);
    }

    reset(){
        this.body.position.x = this.initPos.x;
        this.body.position.y = this.initPos.y;
        this.body.angle = 0;
        Body.setVelocity(this.body, {x: 0, y: 0});
        Body.setAngularVelocity(this.body, 0);
    }

    show(){
        fill(this.c);
        push();
        translate(this.body.position.x, this.body.position.y);
        rotate(this.body.angle);
        square(0,0, this.boxSize);
        pop();
    }
}