
function fuelFilterPostFunctionAvoidPikes(){
    if (value > 10000 || value < 10 ) return prevValue;
    return value;
}