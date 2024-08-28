class Dunescape{
    constructor(res, noiseDetail, minHeight, maxHeight){
        this.noiseDetail = noiseDetail;
        this.res = res;
        this.minHeight = minHeight;
        this.maxHeight = maxHeight;
        this.terrain = [];
        this.makeDune();
    }

    makeDune(){
        for(let x = 0; x < width/this.res; x ++){
            this.terrain[x] = [];
            for(let y = 0; y < width/this.res; y ++){
                this.terrain[x][y] = map(noise(x*this.res*this.noiseDetail, y*this.res*this.noiseDetail), 0, 1, this.minHeight, this.maxHeight);
            }
        }
    }

    show(){
        
        for(let y = 0; y < width/this.res; y++){
            beginShape(TRIANGLE_STRIP);
            for(let x = 0; x < width/this.res; x++){
                vertex(-width/2 + x*this.res, -height/2 + y*this.res, this.terrain[x][y]);
                vertex(-width/2 + x*this.res, -height/2 + (y+1)*this.res, this.terrain[x][y+1]);
            }
            endShape();
        }
        
    }
}