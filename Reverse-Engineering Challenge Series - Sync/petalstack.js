class PetalStack{
    constructor(light, dark, period){
        this.period = period;
        this.light = light;
        this.dark = dark;
        this.petals = [];
        this.noiseVal;
        for(let i = 0; i < petalCount; i++){
            this.petals.push(
                new Petal(
                    1 + i * 0.5, 
                     i * (TWO_PI/24) / petalCount, 
                    lerpColor(this.light, this.dark, i/petalCount),
                    this.period
                    )
                )
        }
    }

    update(){
        for(let p of this.petals){
            p.update();
        }
    }
}