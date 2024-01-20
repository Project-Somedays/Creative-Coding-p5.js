class Letter{
    constructor(x,y,t){
      let a = random(TAU);
      this.target = createVector(x,y);
      // this.start = createVector(sqrt(2)*max(width, height)*cos(a),sqrt(2)*max(width,height)*sin(a)); // a randomPoint outside the screen
      this.start = createVector(random(width), random(0.88*height,0.9*height));
      this.p = createVector(this.start.x,random(-2*height,-1.05*height));
      this.v = createVector(0,0);
      this.a = createVector(0,0);
      this.t = t;
      this.cntrl = 0;
      this.progress = 0;

      // this.delay = map(this.d, 0, max(width, height)*sqrt(2),0,maxDelay);
      this.delay = random(maxDelay);
      this.colour = color(255);
     
    }
    
    fall(){
        if(this.p.y <= this.start.y){
            this.a.set(0,G);
            this.v.add(this.a);
            this.p.add(this.v);
        } else {
            this.start.set(this.p.x, this.p.y);
        }
    }

  
    update(){
      // if we've gone past the threshold of delay
      if(frameCount - startFrame > this.delay){
        this.cntrl = min(this.cntrl + 1/framesToAppear, 1); // limits x to between 0 and 1
        this.progress = easeInOutSine(this.cntrl);
        this.p.x = lerp(this.start.x, this.target.x, this.progress);
        this.p.y = lerp(this.start.y, this.target.y, this.progress);
      }
      
      // else
      this.v.add(this.a);
      this.p.add(this.v);
      this.a.set(0,0);
      
    }
  
    show(){
      // things cloests to the trigger point get delayed the least
      fill(this.colour);
      noStroke();
        // textSize(tSize*standardTextSizeProportion);
        textSize(sampleEvery);
        text(this.t, this.p.x, this.p.y);
    }
  }