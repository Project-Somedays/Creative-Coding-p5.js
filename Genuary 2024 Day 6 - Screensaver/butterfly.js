class Butterfly{
    constructor(animationSet){
      this.c = random(colours);
      this.p = createVector(width/2,height/2);
      this.sOffset = random(1000);
      this.rOffset = random(1000);
      this.aOffset = random(10000);
      this.poses = animationSet;
      this.poseIx = random([0,1,2,3]); // start at some random pose
      // this.rStep = constrain(abs(randomGaussian()+1)*0.005,0.1, 3);
      // this.aStep = constrain(abs(randomGaussian()+1)*0.005,0.1, 3);
      // this.sStep = constrain(abs(randomGaussian()+1)*0.005,0.1, 3);
      // this.rStep = 0.01;
      // this.aStep = 0.01;
      // this.sStep = 0.01;
      this.r;
      this.a;
      this.s;
      this.prevHeadings = [];
      this.prevP = createVector(this.p.x, this.p.y);
      this.currentHeading;
    }
  
    update(spotlightP){
      this.prevP.set(this.p.x, this.p.y); // update previous position
      this.s = getVal(this.sOffset, sizeMinScale, sizeMaxScale); // change the scale
      this.r = getVal(this.rOffset,rMin, rMax)*rAv; 
      this.a = getVal(this.aOffset,-TAU, TAU); 
      this.p.set(spotlightP.x+this.r*cos(this.a), spotlightP.y + this.r*sin(this.a)); // update p
      this.aOffset += aStep;
      this.rOffset += rStep;
      this.sOffset += sStep;
      let heading = p5.Vector.sub(this.p, this.prevP).heading(); // calculate the new heading
      if(heading < 0){
        heading += TWO_PI; // ensuring that headings are always positve for the sake of averages
      }      
      this.prevHeadings.push(heading); //push it to the array
      if(this.prevHeadings.length > headingBufferSize) this.prevHeadings.splice(0,1); // if too long, get rid of te first (oldest) element
      this.currentHeading = calculateAverage(this.prevHeadings); // set current heading to an average of the last headingBufferSize headings
      
      // every 2 frames, move to the next pose
      if(frameCount%2 === 0){
        console.log(`poseIx = ${this.poseIx}, moving onto ${(this.posIx + 1)%this.poses.length}`);
        this.poseIx = (this.poseIx + 1)%this.poses.length;
      }
    }
  
    show(){
      push();
      translate(this.p.x, this.p.y);
      scale(this.s)
      rotate(this.currentHeading);
      fill(this.c);
      // triangle(0,-50,100,0,0,50);
      image(this.poses[this.poseIx],0,0);
      pop();
  
    }
  }