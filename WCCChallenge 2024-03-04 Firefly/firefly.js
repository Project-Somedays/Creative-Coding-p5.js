class FireFly{
    constructor(targetX, targetY, c, s){
        this.p = createVector(0,0);
        this.start = createVector(0,0);
        this.target = createVector(targetX, targetY);
        this.bboxXMin = this.target.x - neighbourhood/2;
        this.bboxXMax = this.target.x + neighbourhood/2;
        this.bboxYMin = this.target.y - neighbourhood/2;
        this.bboxYMax = this.target.y + neighbourhood/2;
        this.nXOff = random(1000);
        this.nYOff = random(1000);
        this.targetc = c;
        this.c = c;//color(255, 255, 0); // default is bright yellow
        this.s = s;
    }

    update(){
        let xL = lerp(this.bboxXMin, this.target.x - 1, convergeTracker);
        let xR = lerp(this.bboxXMax, this.target.x + 1, convergeTracker);
        let yD=  lerp(this.bboxYMin, this.target.y - 1, convergeTracker);
        let yU = lerp(this.bboxYMax, this.target.y + 1, convergeTracker);
        let nx = map(noise(this.nXOff + globOffset), 0, 1, xL, xR);
        let ny = map(noise(this.nYOff + globOffset), 0, 1, yD, yU);
        this.p.set(nx, ny);
    }

    show(){
        fill(this.c);
        circle(this.p.x, this.p.y, this.s);
    }
}