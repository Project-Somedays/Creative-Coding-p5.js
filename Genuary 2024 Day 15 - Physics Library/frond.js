// Coding Train / Daniel Shiffman
// 5.20 Matter.js tutorial Constraints

// https://www.youtube.com/watch?v=szztTszPp-8

class Segment{
    constructor(x, y, r, fixed) {
        this.x = x;
        this.y = y;
        this.r = r;
        let options = {
            friction: 0,
            airFriction: 0.1,
            restitution: 0.5,
            isStatic: fixed,
            mass: 20
        }
        this.body = Bodies.circle(this.x, this.y, this.r,  options);
        Composite.add(world, this.body);
    }

    // applyForce(f){
    //     // ball, {x: ball.position.x, y: ball.position.y}, {x: 0.05, y: 0}
    //     Body.applyForce(this.body, {x: this.x, y: this.y}, {x: 10, y: f.y});
    // }

    show() {
        let pos = this.body.position;
        let angle = this.body.angle;
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        strokeWeight(1);
        fill(255);
        ellipse(0, 0, this.r*2);
        pop();
    }
}

class Frond{
    constructor(x,y){
        this.p = createVector(x,y);
        this.segments = [];
        let prev = null;
    for (let i = 0; i < segPerFrond; i++) {
        let fixed = false;
        if (!prev) {
            fixed = true;
        }
        let s = new Segment(x, y + i*lineLength/segPerFrond, segL/2, fixed);
        this.segments.push(s);
        if (prev) {
            fixed = true;
            let options = {
                bodyA: s.body,
                bodyB: prev.body,
                length: segL,
                stiffness: 0.3,
                restitution: 0.5
            }
            let constraint = Constraint.create(options);
            World.add(world, constraint);
        }
        prev = s;
    }
    }

    applyForce(f){
        for(let s of this.segments){
            s.applyForce(f);
        }
    }

    show() {
        for(let s of this.segments){
            // stroke(255);
            s.show();
        }
    }
    
}