class Bolt{
    constructor(){
        this.aOff = random(1000);
        this.dir;
        this.nodes;
        this.update();
    }

    update(){
        this.aOff += srcASpeed;
        this.dir = getPositiveHeading(p5.Vector.fromAngle(map(noise(this.aOff),0,1,-TAU, TAU)).heading());
        let filteredField = [...field].filter(p => isWithinAngle(p.p, middle.p, this.dir) && p5.Vector.dist(p.p, middle.p) < maxR);
        this.nodes = filteredField.sort((a,b) => p5.Vector.dist(a.p,middle.p) - p5.Vector.dist(b.p,middle.p));
        this.nodes.unshift(middle);
    }

    showNodes(){
        stroke(255);
        push();
            translate(middle.p.x, middle.p.y);
            line(0, 0, width*0.4*cos(this.dir+aRange/2),width*0.4*sin(this.dir+aRange/2));
            line(0, 0, width*0.4*cos(this.dir-aRange/2),width*0.4*sin(this.dir-aRange/2));
        pop();
        fill(255);
        for(let each of this.nodes){
            each.show(color(255));
        }
    }

    showAll(){
        noFill();
        this.show(secondaryColour, 1);
        this.show(tertiaryColour, 1);
        this.show(color(255), 3);
    }

    show(colour, weight){
        stroke(colour);
        strokeWeight(weight);
        beginShape();
        let currentCandidate = this.nodes[0];
        vertex(currentCandidate.p.x, currentCandidate.p.y);
        for(let i = 1; i < this.nodes.length; i++){
            if(isWithinAngle(this.nodes[i].p, currentCandidate.p, this.dir)){
                currentCandidate = this.nodes[i];
                vertex(currentCandidate.p.x + jitter(), currentCandidate.p.y + jitter());
              }
        }
        endShape();
        scorchmarks.push(new ScorchMark(currentCandidate.p.x, currentCandidate.p.y));

        // only add the explosion on the main bolt
        if(weight == mainWeight){
            explosions.push(new Explosion(currentCandidate.p.x, currentCandidate.p.y));
        }
    }

    

}
/*
function drawBolt(candidateNodes, dir){
  beginShape();
  noFill();
  strokeWeight(5);
  let currentCandidate = middle;
  
  vertex(currentCandidate.p.x, currentCandidate.p.y);
  for(let i = 0; i < candidateNodes.length; i++){
    if(isWithinAngle(candidateNodes[i].p, currentCandidate.p, dir)){
      currentCandidate = candidateNodes[i];
      vertex(currentCandidate.p.x + jitter(), currentCandidate.p.y + jitter());
    }
  }
  endShape(OPEN);
  // scorchmarks.push(new ScorchMark(currentCandidate.p.x, currentCandidate.p.y));
}
*/