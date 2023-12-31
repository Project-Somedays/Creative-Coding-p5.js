class Bee{
    constructor(x,y, target, xOff, yOff, scaleOff,
        beeScaleFactor){
        this.p = createVector(x,y);
        this.target = target;
        this.prevX = x;
        this.xOff = xOff;
        this.yOff = yOff;
        this.scaleOff = scaleOff;
        this.currentPose = random([0,1]);
        this.beeScaleFactor = beeScaleFactor;//beeScaleFactor*0.1;
        this.startP = createVector(0,0);
        this.startScale;
    }

    cruise(){
        // work out which way the bees are facing
        this.prevX = this.p.x;
        // set the new x,y coords
        let x = map(noise(this.xOff + globOff),0,1,0,width);
        let y = map(noise(this.yOff + globOff),0,1,0,height);
        this.p.set(x,y);
        // bring the bee closer or further from camera
        // this.beeScaleFactor = 1 map(noise(this.scaleOff + globOff/4),0,1,0.25, 1.25);
        // cycle Pose on 2s
        if(frameCount % 2 === 0){
            this.currentPose = (this.currentPose + 1)%2;
        }
    }

    mark(){
        this.startP.set(this.p.x, this.p.y);
        this.startScale = this.beeScaleFactor;
    }
    
    converge(){
        this.p.x = lerp(this.startP.x, this.target.x, lerpSliderPos);
        this.p.y = lerp(this.startP.y, this.target.y, lerpSliderPos);
        // this.beeScaleFactor = lerp(this.startScale,sampleRate,lerpSliderPos)
    }

    show(){
        push();
        translate(this.p.x, this.p.y);
        if(this.p.x < this.prevX){
        scale(-1,1);
        }
        // image(flightPoses[this.currentPose],0, 0, this.beeScaleFactor*globBeeScaleFactor*beeDefaultWidth, this.beeScaleFactor*globBeeScaleFactor*beeDefaultHeight);
        image(flightPoses[this.currentPose],0,0);
        pop();
    }
}