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
                // if we've crashed into a sun or gone way too far out (probably hit escape velocity), mark as crashed
                if(p2c < sun.s/2 || p2c > 2*max(width, height)){
                    isCrashed = true;
                    break;
                }; // if we've crashed or if we've 
                attractionF.setMag(sun.mass*G/p2c); // set the mag inversely proportional to the distance
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
  
    show(traceIx){
      if(traceIx === colours.length){
        for(let trace of this.traces){
          trace.show()
        }
      } else{
        this.traces[traceIx].show();
      }
      
  
    }
  }
  