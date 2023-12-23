class Explosion{
    constructor(x,y){
        this.p = createVector(x,y);
        this.sparks = [];
        this.isDone = false;
        for(let i = 0 ; i < sparkCount; i++){
            this.sparks.push(new Spark(this.p.x, this.p.y));
        }
    }

    updateAndShow(){
        //clean up as we go
        for(let i = this.sparks.length - 1; i >= 0; i --){
            this.sparks[i].updateAndShow();
            if(this.sparks[i].isDone){
                this.sparks.splice(i, 1);
            }
        }
        this.isDone = this.sparks.length === 0;
    }
}