f=0,draw=(a=>{for(f++||createCanvas(w=1080,w),background(0,50),noStroke(),p=w/10,N=21,n=N**2,s=(w-2*p)/N;n>0;k=millis()/w+n/2,l=w/2,c=(n=>l+l*n),o=sin(2*k),fill(c(sin(k)),c(o),c(-o)),ellipse(int(n--/N)*s+p,map(fract(n/N),0,.9,0,20)*s+p,s-3+s*cos(k)));});