



// Daniel Shiffman
// http://codingtra.in
// Islamic Star Patterns
// Video Part 1: https://youtu.be/sJ6pMLp_IaI
// Video Part 2: [coming soon]
// Based on: http://www.cgl.uwaterloo.ca/csk/projects/starpatterns/

// Repo with more tiling patterns and features
// https://github.com/CodingTrain/StarPatterns

// var poly;
var polys = [];

var angle = 75;
var delta = 10;
let angleOffset;
let deltaOffset;

let noiseProgressionDivider = 100;

var deltaSlider;
var angleSlider;

function setup() {
  createCanvas(1920, 1080);
  strokeWeight(1);
  colorMode(HSB, 360, 100, 100, 100);
  angleOffset = random(1000);
  deltaOffset = random(1000);
  //angleMode(DEGREES);
  deltaSlider = createSlider(0, 25, 10);
  angleSlider = createSlider(0, 90, 75);
  //colour set by the average of the two
  

  var inc = 100;
  for (var x = 0; x < width; x += inc) {
    for (var y = 0; y < height; y += inc) {
      var poly = new Polygon();
      poly.addVertex(x, y);
      poly.addVertex(x + inc, y);
      poly.addVertex(x + inc, y + inc);
      poly.addVertex(x, y + inc);
      poly.close();
      polys.push(poly);
    }
  }
  background(0);
}

function draw() {
  background(0,0,0,2);
  let c = map((noise(angleOffset + frameCount/noiseProgressionDivider) + noise(deltaOffset + frameCount/noiseProgressionDivider))/2,0,1,0, 360);
  stroke(color(c, 100, 100, 10));
  angle = map(noise(angleOffset + frameCount/noiseProgressionDivider),0,1,0,90); //angleSlider.value();
  delta = map(noise(deltaOffset + frameCount/noiseProgressionDivider),0,1,0,50);//deltaSlider.value();
  //console.log(angle, delta);
  for (var i = 0; i < polys.length; i++) {
    polys[i].hankin();
    polys[i].show();
  }
  
}


// Daniel Shiffman
// http://codingtra.in
// Islamic Star Patterns
// Video Part 1: https://youtu.be/sJ6pMLp_IaI
// Video Part 2: [coming soon]
// Based on: http://www.cgl.uwaterloo.ca/csk/projects/starpatterns/

// Repo with more tiling patterns and features
// https://github.com/CodingTrain/StarPatterns

function Edge(a, b) {
  this.a = a;
  this.b = b;
  this.h1;
  this.h2;

  this.show = function() {
    // stroke(255, 50);
    //line(this.a.x, this.a.y, this.b.x, this.b.y);
    this.h1.show();
    this.h2.show();
  }

  this.hankin = function() {
    var mid = p5.Vector.add(this.a, this.b);
    mid.mult(0.5);

    var v1 = p5.Vector.sub(this.a, mid);
    var v2 = p5.Vector.sub(this.b, mid);
    var offset1 = mid;
    var offset2 = mid;
    if (delta > 0) {
      v1.setMag(delta);
      v2.setMag(delta);
      offset1 = p5.Vector.add(mid, v2);
      offset2 = p5.Vector.add(mid, v1);
    }
    v1.normalize();
    v2.normalize();


    v1.rotate(radians(-angle));
    v2.rotate(radians(angle));

    this.h1 = new Hankin(offset1, v1);
    this.h2 = new Hankin(offset2, v2);

  }

  this.findEnds = function(edge) {
    this.h1.findEnd(edge.h1);
    this.h1.findEnd(edge.h2);
    this.h2.findEnd(edge.h1);
    this.h2.findEnd(edge.h2);
  }


}


// Daniel Shiffman
// http://codingtra.in
// Islamic Star Patterns
// Video Part 1: https://youtu.be/sJ6pMLp_IaI
// Video Part 2: [coming soon]
// Based on: http://www.cgl.uwaterloo.ca/csk/projects/starpatterns/

// Repo with more tiling patterns and features
// https://github.com/CodingTrain/StarPatterns

function Polygon() {
  this.vertices = [];
  this.edges = [];

  this.addVertex = function(x, y) {
    var a = createVector(x, y);
    var total = this.vertices.length;
    if (total > 0) {
      var prev = this.vertices[total - 1];
      var edge = new Edge(prev, a);
      this.edges.push(edge);
    }
    this.vertices.push(a);
  }

  this.close = function() {
    var total = this.vertices.length;
    var last = this.vertices[total - 1];
    var first = this.vertices[0];
    var edge = new Edge(last, first);
    this.edges.push(edge);
  }

  this.hankin = function() {
    for (var i = 0; i < this.edges.length; i++) {
      this.edges[i].hankin();
    }

    for (var i = 0; i < this.edges.length; i++) {
      for (var j = 0; j < this.edges.length; j++) {
        if (i !== j) {
          this.edges[i].findEnds(this.edges[j]);
        }
      }
    }
  }

  this.show = function() {
    for (var i = 0; i < this.edges.length; i++) {
      this.edges[i].show();
    }
  }

}



function Hankin(a, v) {
  this.a = a;
  this.v = v;
  this.b = p5.Vector.add(a, v);
  this.end;
  this.prevD;

  this.show = function() {
    // stroke(255, 0, 255);
    line(this.a.x, this.a.y, this.end.x, this.end.y);
    // fill(255);
    // ellipse(this.a.x, this.a.y, 8);
    // if (this.end) {
    //   fill(255, 255, 0);
    //   ellipse(this.end.x, this.end.y, 8);
    // }
  }

  this.findEnd = function(other) {
    // line line intersection???
    // this.a, this.v  (P1, P2-P1)
    // other.a, other.v (P3, P4-P3)

    // From: http://paulbourke.net/geometry/pointlineplane/
    var den = (other.v.y * this.v.x) - (other.v.x * this.v.y);
    if (!den) {
      return;
    }
    var numa = (other.v.x * (this.a.y - other.a.y)) - (other.v.y * (this.a.x - other.a.x));
    var numb = (this.v.x * (this.a.y - other.a.y)) - (this.v.y * (this.a.x - other.a.x));
    var ua = numa / den;
    var ub = numb / den;
    var x = this.a.x + (ua * this.v.x);
    var y = this.a.y + (ua * this.v.y);

    if (ua > 0 && ub > 0) {
      var candidate = createVector(x, y);
      var d1 = p5.Vector.dist(candidate, this.a);
      var d2 = p5.Vector.dist(candidate, other.a);
      var d = d1 + d2;
      var diff = abs(d1 - d2);
      if (diff < 0.001) {
        if (!this.end) {
          this.end = candidate;
          this.prevD = d;
        } else if (d < this.prevD) {
          this.prevD = d;
          this.end = candidate;
        }
      }
    }



  }

}
