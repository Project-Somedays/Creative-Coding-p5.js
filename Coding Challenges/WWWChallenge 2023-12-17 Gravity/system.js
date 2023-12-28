class System{
    constructor(cx, cy, planetSep){
        this.a = random(TAU);
        this.c = createVector(cx,cy);
        this.planetSep = planetSep
        this.planets = []
        for(let i = 0; i < planetCount; i++){
            let a = i * TAU/planetCount + this.a;
            let x = this.c.x + this.planetSep/2*cos(a);
            let y = this.c.y + this.planetSep/2*sin(a)
            let m = randomGaussian()*avPlanetMass;
            let d = avPlanetSize; //randomGaussian()*avPlanetSize;
            this.planets.push(new Planet(x, y, m, d, a));
      }
    }

    update(){
        this.a += systemOrbitRate;
        for(let i = 0; i < planetCount; i++){
            let a = i * TAU/planetCount + this.a;
            let x = this.c.x + planetSep/2*cos(a);
            let y = this.c.y + planetSep/2*sin(a);
            this.planets[i].p.set(x,y);
        }
    }
    
    show(){
        fill(255, 255,0);
        for(let p of this.planets){
            p.show();
        }
    }
}

