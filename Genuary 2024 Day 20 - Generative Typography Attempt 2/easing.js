
function easeInOutSine(x) {
    return 0.5*(cos(PI*x) + 1);
    }
  

function easeInSine(x){
    return 1 - Math.cos((x * Math.PI) / 2);
    }