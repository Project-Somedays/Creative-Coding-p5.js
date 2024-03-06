class Swarm{
    constructor(fireflies){
        this.swarm = fireflies;
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