    class Mozzie{
        constructor(fillDuration){
            this.p = createVector(0,0);
            this.xOff = random(1000);
            this.yOff = random(1000);
            this.xSpeed = random(minSpeed,maxSpeed);
            this.ySpeed = random(minSpeed, maxSpeed);
            this.xLimLower = mozzieDefaultXLimLower;
            this.xLimUpper = mozzieDefaultXLimUpper;
            this.yLimLower = mozzieDefaultYLimLower;
            this.yLimUpper = mozzieDefaultYLimUpper;
            this.isForeground = random() < foregroundProportion; // marks it as foreground
            this.prevX = this.p.x;
            this.isFlying = true;
            this.fillPerc = 0;
            this.flightPoseIx = random([0,1]);
            this.a1 = createVector(-0.3*mL.width*mS/2, 0);
            this.a2 = createVector(0.28*mL.width*mS/2, 0);
            this.fillProgress = 0;
            this.fillDuration = fillDuration;
            this.fillSpeed = 1/fillDuration;
            this.fillMax = 0.4*mL.height*mS;
            this.isLanding = false;
            this.cp = createVector((this.a1.x + this.a2.x)/2, (this.a1.y + this.a2.y)/2);
            this.drinkCycle = new DrinkCycle(mL.width*mS*0.21,mL.height*mS*0.53, mL.width*mS, this.fillSpeed*6);
            this.target;
        }

        acquireTarget(target){
            this.target = createVector(target.x, target.y);
        }

        update(){
            if(this.isFlying){
                this.prevX = this.p.x;
                this.xOff += this.xSpeed;
                this.yOff += this.ySpeed;
                this.p.set(getVal(this.xOff, this.xLimLower,this.xLimUpper), getVal(this.yOff, this.yLimLower, this.yLimUpper));
                if(frameCount % 2 === 0) this.flightPoseIx = (this.flightPoseIx + 1)%flightPoses.length;
                
                if(this.isLanding){
                    this.xLimLower = lerp(mozzieDefaultXLimLower, this.target.x, landingCntrl);
                    this.xLimUpper = lerp(mozzieDefaultXLimUpper, this.target.x, landingCntrl);
                    this.yLimLower = lerp(mozzieDefaultYLimLower, this.target.y, landingCntrl);
                    this.yLimUpper = lerp(mozzieDefaultYLimUpper, this.target.y, landingCntrl);
                }
                return;
            }

            // otherwise
            if(this.fillProgress < 1){
                this.fillProgress += this.fillSpeed;
                this.drinkCycle.update();
                this.cp.y = this.fillProgress*this.fillMax;
            } 
            
            }
            

        show(shrinkFactor, overridePos = this.p){ // had to have this so I could draw the enlarged version
            // if flying

            push()
            translate(overridePos.x, overridePos.y);
            scale(shrinkFactor);
            if(this.p.x > this.prevX) scale(-1, 1);
            this.drinkCycle.show();
            this.showBelly()
            if(this.isFlying){
                image(flightPoses[this.flightPoseIx], 0, 0, mozzieFlying1.width*mS, mozzieFlying1.height*mS);
            } else{
                image(mL, 0, 0, mL.width*mS, mL.height*mS);
            }
            
            pop();

            
            
        }

        showBelly(){
            push();
                translate(mL.width*mS/20, -mL.height*mS/7);
                rotate(radians(15));
                // fill(255, 0, 0);

                // circle(this.a1.x, this.a1.y, 10);
                // fill(0, 255, 0);
                
                // circle(this.a2.x, this.a2.y, 10);
                // fill(0, 0, 255);
                // circle(this.cp.x, this.cp.y, 10);
                // console.log(`cp.x = ${this.cp.x}, cp.y = ${this.cp.y}`);
                
                fill(136, 8, 8); // blood red
                noStroke();
                bezier(
                    this.a1.x, this.a1.y,  //a1
                    this.cp.x - mL.width*mS/10, this.cp.y, // cp1
                    this.cp.x + mL.width*mS/8, this.cp.y, // cp2
                    this.a2.x, this.a2.y // a2
                    );
                fill(255);
                // text(`${round(this.fillProgress*100,1)}`, this.p.x, this.p.y);
            pop();
            
        }
    }

    