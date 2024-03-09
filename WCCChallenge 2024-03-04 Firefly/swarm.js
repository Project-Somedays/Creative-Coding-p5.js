class Swarm{
    constructor(startArrayOfTargets){
        this.swarm = [];
        this.mapFireFliesToTargets(startArrayOfTargets)
    }

    update(){
        for(let ff of this.swarm){
            ff.update();
        }
    }

    mapFireFliesToTargets(targetArray){
    
        if(this.swarm.length > targetArray.length){
        this.swarm = this.swarm.slice(0, targetArray.length);
    }

    // remap to targets (or add new fireflies to the swarm)
    for(let i = 0; i < targetArray.length; i++){
        let t = targetArray[i];
        if(i >= this.swarm.length){
           this.swarm.push(new FireFly(t.x, t.y, t.c))
        } else {
            this.swarm[i].remap(t.x, t.y, t.c);
            this.swarm[i].refreshBoundingBoxes();
        }   
    }

    }

    show(){
        for(let ff of this.swarm){
            ff.show();
        }
    }
}