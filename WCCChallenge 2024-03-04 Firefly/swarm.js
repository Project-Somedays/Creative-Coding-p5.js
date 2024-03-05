class Swarm{
    constructor(n){
        this.swarm = [];
        for(let i = 0; i < n; i++){
            this.swarm.push(new FireFly(random(width), random(height), '#E7BE61'));
        }
    }

    update(){
        for(let ff of this.swarm){
            ff.update();
        }
    }

    show(){
        for(let ff of this.swarm){
            ff.show();
        }
    }
}