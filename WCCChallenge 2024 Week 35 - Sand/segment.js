// from ChatGPT

class Segment {
    constructor(x, y, angle, angleZ, len, colour,weight) {
      this.a = createVector(x, y, 0);
      this.angle = angle;
      this.angleZ = angleZ;
      this.len = len;
      this.dir = null;
      this.b = createVector();
      this.calculateB();
      this.colour = colour;
      this.weight = weight;
    }
    
    calculateB() {
      
      // this.b.x = this.a.x + this.len * cos(this.angle) * cos(this.angleZ);
      // this.b.y = this.a.y + this.len * sin(this.angle) * cos(this.angleZ);
      // this.b.z = this.a.z + this.len * sin(this.angleZ);
      // this.b = p
    }
    
    setPosition(x, y, z) {
      this.a.set(x, y, z);
      this.calculateB();
    }
    
    follow(tx, ty, tz) {
      let target = createVector(tx, ty, tz);
      this.dir = p5.Vector.sub(target, this.a);
      // this.angle = dir.heading();
      // this.angleZ = atan2(dir.y, dir.x);
      this.dir.setMag(this.len);
      this.dir.mult(-1);
      this.a = p5.Vector.add(target, dir);
      this.b = p5.Vector.add(this.a, this.dir)
    }
    
    update() {
      this.calculateB();
    }
    
    show() {
        let middle = p5.Vector.lerp(this.a, this.b, 0.5);
    //   stroke(this.colour);
    //   strokeWeight(this.weight);
    //   line(this.a.x, this.a.y, this.a.z, this.b.x, this.b.y, this.b.z);
    fill(this.colour);
    stroke(0);
    push();
    translate(middle.x, middle.y, middle.z);
    sphere(this.weight);
    pop();
    }
  }