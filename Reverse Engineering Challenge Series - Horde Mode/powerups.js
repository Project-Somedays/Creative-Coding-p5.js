class Powerup{
    constructor(x,y, health, speed, power){
        this.p = createVector(x,y);
        this.health = health;
        this.power = power;
        this.speed 
    }

    update(){
        this.p.y += speed;
    }

}