class Saucer{
    constructor(x,y, targetY){
        this.start = createVector(x,y);
        this.p = createVector(x,y);
        this.targetY = targetY;
        this.control = 0;
        this.progress = 0;
        this.isDescending = true;
        this.isAscending = false;
    }

    update(){
        if(this.control < 1 && this.isDescending){
            this.control += 1/(framesToAppear+1.5*maxDelay);
        }
        if(this.isAscending && this.control > 0){
            this.control -= 1/framesToAppear;
        }
        this.progress = easeInOutSine(this.control);
        this.p.y = lerp(this.start.y, this.targetY, this.progress);
    }
    
    show(){
        text(saucerText, this.p.x, this.p.y);
    }
}