// Daniel Shiffman
// http://codingtra.in
// Islamic Star Patterns
// Video Part 1: https://youtu.be/sJ6pMLp_IaI
// Video Part 2: [coming soon]
// Based on: http://www.cgl.uwaterloo.ca/csk/projects/starpatterns/

// Repo with more tiling patterns and features
// https://github.com/CodingTrain/StarPatterns

function Polygon(x,y) {
  this.vertices = [];
  this.edges = [];
  this.p = createVector(x/noiseZoom,y/noiseZoom);
  this.angle = 0;
  this.delta = 0;

  this.update = function(){
    this.angle = map(noise(this.p.x, this.p.y, frameCount/noiseProgRate),0,1,0,90);
    this.delta = map(noise(this.p.x + 25, this.p.y + 25, frameCount/noiseProgRate),0,1,0,50);
  }

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
      this.edges[i].hankin(this.angle, this.delta);
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
