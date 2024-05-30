// generates scrap, chooses a random target, places the scrap onto the target
class Dispenser{
    constructor(x,y){
     this.p = createVector(x,y);
     this.refresh();
     this.isRunning = true;
    }
  
    update(){
    //   if(!this.isRunning) return;
      if(frameCount - this.t < moveFrames) this.scrap.update(0.5*(cos((frameCount-this.t)*PI/moveFrames)+1));
      if(frameCount - this.t === moveFrames){
        genLetters.push(this.scrap); // move
        this.refresh();
      }
    //   this.isRunning = targets.filter(t => !t.placing).length > 0;
      
      
    }
  
    refresh(){
      let ts = targets.filter(t => !t.placing);
      if(ts.length === 0){
        this.isRunning = false;
        return;
      }
      this.target = ts[0];
      this.target.markOff();
      this.scrap = new GenLetter(this.p.x, this.p.y, this.target.p);
      this.t = frameCount;
    }
  
    show(){
      this.scrap.show();
    }
  }