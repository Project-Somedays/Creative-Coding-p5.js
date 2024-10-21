let flock = [];
let octree;
let worldSize;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  worldSize = min(windowWidth, windowHeight) * 0.8;
  for (let i = 0; i < 200; i++) {
    flock.push(new Boid());
  }
}

function draw() {
  background(51);
  
  // Recreate the octree each frame
  octree = new Octree(new Box(0, 0, 0, worldSize, worldSize, worldSize));
  
  for (let boid of flock) {
    octree.insert(boid);
  }
  
  for (let boid of flock) {
    boid.edges();
    boid.flock(octree);
    boid.update();
    boid.show();
  }

  orbitControl(); 
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  worldSize = min(windowWidth, windowHeight) * 0.8;
  for (let boid of flock) {
    boid.adjustToNewWorldSize();
  }
}

class Boid {
  constructor() {
    this.position = createVector(
      random(-worldSize/2, worldSize/2),
      random(-worldSize/2, worldSize/2),
      random(-worldSize/2, worldSize/2)
    );
    this.velocity = p5.Vector.random3D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.maxForce = worldSize * 0.0005;
    this.maxSpeed = worldSize * 0.01;
    this.size = worldSize * 0.005;
  }
  
  edges() {
    let halfWorld = worldSize / 2;
    if (this.position.x > halfWorld) this.position.x = -halfWorld;
    else if (this.position.x < -halfWorld) this.position.x = halfWorld;
    if (this.position.y > halfWorld) this.position.y = -halfWorld;
    else if (this.position.y < -halfWorld) this.position.y = halfWorld;
    if (this.position.z > halfWorld) this.position.z = -halfWorld;
    else if (this.position.z < -halfWorld) this.position.z = halfWorld;
  }
  
  adjustToNewWorldSize() {
    this.position.mult(worldSize / (min(windowWidth, windowHeight) * 0.8));
    this.maxForce = worldSize * 0.0005;
    this.maxSpeed = worldSize * 0.01;
    this.size = worldSize * 0.005;
  }
  
  align(boids) {
    let perceptionRadius = worldSize * 0.1;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.position.x, this.position.y, this.position.z,
        other.position.x, other.position.y, other.position.z
      );
      if (other != this && d < perceptionRadius) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }
  
  cohesion(boids) {
    let perceptionRadius = worldSize * 0.1;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.position.x, this.position.y, this.position.z,
        other.position.x, other.position.y, other.position.z
      );
      if (other != this && d < perceptionRadius) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }
  
  separation(boids) {
    let perceptionRadius = worldSize * 0.1;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.position.x, this.position.y, this.position.z,
        other.position.x, other.position.y, other.position.z
      );
      if (other != this && d < perceptionRadius) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d * d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }
  
  flock(octree) {
    let nearby = octree.query(new Box(
      this.position.x - worldSize * 0.1,
      this.position.y - worldSize * 0.1,
      this.position.z - worldSize * 0.1,
      worldSize * 0.2,
      worldSize * 0.2,
      worldSize * 0.2
    ));
    let alignment = this.align(nearby);
    let cohesion = this.cohesion(nearby);
    let separation = this.separation(nearby);
    
    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }
  
  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
  }
  
  show() {
    push();
    translate(this.position.x, this.position.y, this.position.z);
    ambientMaterial(255);
    sphere(this.size);
    pop();
  }
}

class Box {
  constructor(x, y, z, w, h, d) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    this.h = h;
    this.d = d;
  }
  
  contains(point) {
    return (point.x >= this.x - this.w &&
            point.x < this.x + this.w &&
            point.y >= this.y - this.h &&
            point.y < this.y + this.h &&
            point.z >= this.z - this.d &&
            point.z < this.z + this.d);
  }
  
  intersects(box) {
    return !(box.x - box.w > this.x + this.w ||
             box.x + box.w < this.x - this.w ||
             box.y - box.h > this.y + this.h ||
             box.y + box.h < this.y - this.h ||
             box.z - box.d > this.z + this.d ||
             box.z + box.d < this.z - this.d);
  }
}

class Octree {
  constructor(boundary, capacity = 4) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];
    this.divided = false;
  }
  
  subdivide() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let z = this.boundary.z;
    let w = this.boundary.w / 2;
    let h = this.boundary.h / 2;
    let d = this.boundary.d / 2;
    
    this.northwest = new Octree(new Box(x - w, y - h, z - d, w, h, d));
    this.northeast = new Octree(new Box(x + w, y - h, z - d, w, h, d));
    this.southwest = new Octree(new Box(x - w, y + h, z - d, w, h, d));
    this.southeast = new Octree(new Box(x + w, y + h, z - d, w, h, d));
    this.northwestBack = new Octree(new Box(x - w, y - h, z + d, w, h, d));
    this.northeastBack = new Octree(new Box(x + w, y - h, z + d, w, h, d));
    this.southwestBack = new Octree(new Box(x - w, y + h, z + d, w, h, d));
    this.southeastBack = new Octree(new Box(x + w, y + h, z + d, w, h, d));
    
    this.divided = true;
  }
  
  insert(point) {
    if (!this.boundary.contains(point.position)) {
      return false;
    }
    
    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    }
    
    if (!this.divided) {
      this.subdivide();
    }
    
    return (this.northwest.insert(point) ||
            this.northeast.insert(point) ||
            this.southwest.insert(point) ||
            this.southeast.insert(point) ||
            this.northwestBack.insert(point) ||
            this.northeastBack.insert(point) ||
            this.southwestBack.insert(point) ||
            this.southeastBack.insert(point));
  }
  
  query(range, found = []) {
    if (!this.boundary.intersects(range)) {
      return found;
    }
    
    for (let p of this.points) {
      if (range.contains(p.position)) {
        found.push(p);
      }
    }
    
    if (this.divided) {
      this.northwest.query(range, found);
      this.northeast.query(range, found);
      this.southwest.query(range, found);
      this.southeast.query(range, found);
      this.northwestBack.query(range, found);
      this.northeastBack.query(range, found);
      this.southwestBack.query(range, found);
      this.southeastBack.query(range, found);
    }
    
    return found;
  }
}