class Bee{
    constructor(x,y, target, xOff, yOff, scaleOff){
        this.p = createVector(x,y); // for keeping track of position
        this.target = target; // sampled from the underlying text
        this.prevX = x; // for tracking which way the bees are facing
        this.xOff = xOff; // randomised x
        this.yOff = yOff; // randomised y
        this.scaleOff = scaleOff; // randomised scale
        this.currentPose = random([0,1]); // start in a random pose
        this.currentScaleFactor = 0;
        this.xLLim = 0; // min range of x positions
        this.xRLim = width; // max range of x positions
        this.yLLim = 0; // min range of y positionss
        this.yRLim = height; // max range of y positions
    }

    update(){
        // work out which way the bees are facing
        this.prevX = this.p.x;
        
        // set the new x,y coords
        let x = map(noise(this.xOff + globOff),0,1,this.xLLim,this.xRLim);
        let y = map(noise(this.yOff + globOff),0,1,this.yLLim,this.yRLim);
        this.p.set(x,y);
        
        // bring the bee closer or further from camera, but cycle this slower than general movement
        this.currentScaleFactor = map(noise(this.scaleOff + globOff/6),0,1,currentBeeScaleLower, currentBeeScaleUpper);
        
        // cycle the pose on 2s
        if(frameCount % 2 === 0){
            this.currentPose = (this.currentPose + 1)%2;
        }
    }
    
    converge_diverge(){
        // shrink the bounding boxes on x and y. Note: executed globally for bee scale
        this.xLLim = lerp(0, this.target.x-targetBoxSize, lerpPos);
        this.xRLim = lerp(width, this.target.x + targetBoxSize, lerpPos);
        this.yLLim = lerp(0, this.target.y-targetBoxSize, lerpPos);
        this.yRLim = lerp(height, this.target.y + targetBoxSize, lerpPos);
    }

    show(){
        push();
            translate(this.p.x, this.p.y);
            if(this.p.x < this.prevX){
                scale(-1,1);
            }
            // scale globally from the image file and then locally for each bee in the swarm
            let xScale = this.currentScaleFactor*globBeeScaleFactor*beeDefaultWidth;
            let yScale = this.currentScaleFactor*globBeeScaleFactor*beeDefaultHeight;
            image(flightPoses[this.currentPose],0, 0, xScale, yScale);
        
        pop();
    }
}