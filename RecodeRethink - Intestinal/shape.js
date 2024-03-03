class Shape {
    constructor(x_, y_, d_, sep_, t_) {
      this.x = x_;
      this.y = y_;
      this.d = d_;
      this.sep = sep_;
      this.t = t_;
      this.isFinish = false;
    }
  
    move() {
      this.x -= 2;
      if (this.x < width*0.1) {
        this.isFinish = true;
      }
    }
  
    display() {
      push();
      translate(this.x, this.y);
      rotate(this.t + globA);
          for(let i = 0; i < colours.length; i++){
              let x = 0.5*this.sep*cos(i*TWO_PI/colours.length);
              let y = 0.5*this.sep*sin(i*TWO_PI/colours.length);
              fill(colours[i]);
              ellipse(x,y, this.d, this.d);
          }
      
  
      pop();
    }
  }
  