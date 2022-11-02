function roundNumber (num) {
    return Math.round(parseFloat(num) * 100) / 100;
}

function addAllValues (values) {
    var returnValue = 0;
    for(var i = 0; i < values.length; i++) {

        returnValue += values[i].consumption;
    }
    return roundNumber(returnValue);
}