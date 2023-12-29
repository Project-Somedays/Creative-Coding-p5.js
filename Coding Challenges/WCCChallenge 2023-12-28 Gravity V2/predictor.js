class Predictor{
    constructor(x,y){
      this.p = createVector(x,y);
      this.traces = [];
    }
  
    applyForce(f){
      this.a.add(f);
    }
  
    update(){
      for(let i = 0; i < colours.length; i++){
        let trace = [];
        let p = createVector(this.p.x, this.p.y); // copies of the start
        let v = createVector(velocities[i].x, velocities[i].y);
        for(let j = 0; j < predictSteps; j++){
            let a = createVector(0,0);
            let isCrashed = false;
            // exert pulling force of each sun in turn
            for(let sun of suns){
                let attractionF = p5.Vector.sub(sun.p, p); // direction of acceleration
                let p2c = p5.Vector.dist(p, sun.p); // get the distance from the body
                if(p2c < sunSize/2 || p2c > 1.5*max(width, height)){
                    isCrashed = true;
                    break;
                }; // if we've crashed or if we've 
                attractionF.setMag(G/p2c); // set the mag inversely proportional to the distance
                a.add(attractionF); // change the acceleration
            }
            if(isCrashed) break;
            v.add(a); // change the velocity
            p.add(v); // change the position
            
            trace.push(createVector(p.x, p.y)); // add the position to the trace
            }
        this.traces.push(new Trace(colours[i], trace)); // add the trace
      }
       
  
    }
  
    show(){
      for(let trace of this.traces){
        trace.show()
      }
  
    }
  }
  