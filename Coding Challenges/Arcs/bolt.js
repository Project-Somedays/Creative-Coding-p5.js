class Bolt{
    constructor(baseParticle, firstParticle){
        this.baseParticle;
        this.firstParticle = firstParticle;
        this.boltBearing = getPositiveHeading(p5.Vector.sub(firstParticle, baseParticle).heading())
        this.includedParticales = [this.baseNode, this.firstParticle];
        this.lifeSpan = 100;
    }

    show(){
        beginShape();
        for(p of this.includedParticales){
            vertex(p.p.x + jitter(), p.p.y + jitter());
        }
        endShape(OPEN);
    }
}