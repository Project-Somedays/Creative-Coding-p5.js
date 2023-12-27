class Planet{
    constructor(x,y,m, d){
        this.p = createVector(x,y);
        this.m = m;
        this.d = d;
    }

    show(){
        circle(this.p.x, this.p.y, this.d);
    }
}