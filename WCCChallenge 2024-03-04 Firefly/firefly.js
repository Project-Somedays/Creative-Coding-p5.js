class FireFly{
    constructor(targetX, targetY, c){
        this.p = createVector(0,0);
        this.start = createVector(0,0);
        this.target = createVector(targetX, targetY);
        this.bboxXMin = this.target.x - neighbourhood/2;
        this.bboxXMax = this.target.x + neighbourhood/2;
        this.bboxYMin = this.target.y - neighbourhood/2;
        this.bboxYMax = this.target.y + neighbourhood/2;
        this.nXOff = random(1000);
        this.nYOff = random(1000);
        this.c = c;
    }

    update(){
        let nx = map(noise(this.nXOff + globOffset), 0, 1, this.bboxXMin, this.bboxXMax);
        let ny = map(noise(this.nYOff + globOffset), 0, 1, this.bboxYMin, this.bboxYMax);
        this.p.set(nx, ny);
    }

    show(){
        fill(255, 255, 0);
        circle(this.p.x, this.p.y, 10);
    }
}