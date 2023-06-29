
function fuelFilterPostFunctionAvoidPikes(){
    if (value > 10000 || value < 10 ) return prevValue;
    return value;
}

function fuelPercentageAdvanceCellContent(){
    return (value-entity.min_fuel)/(entity.max_fuel-entity.min_fuel) * 100;
}