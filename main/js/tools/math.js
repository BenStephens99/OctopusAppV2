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

function electToPound(house) {
    var electValues = [];
    for (var i = 0; i < house.electricData.length; i++) {
        console.log(electValues)
        electValues.push(roundNumber(house.electricData[i].consumption * house.tariff.kwhElec));
    }

    var standingValues = [];
    if (house.dataPeriod === "day") {
        for (var i = 0; i < electValues.length; i++) {
            standingValues.push(house.tariff.standElec / 24);
        }
    } else if (house.dataPeriod === "week") {
        for (var i = 0; i < electValues.length; i++) {
            standingValues.push(house.tariff.standElec * 7);
        }

    } else if (house.dataPeriod === "month") {
        for (var i = 0; i < electValues.length; i++) {
            standingValues.push(house.tariff.standElec * 30);
        }
    }

    console.log(house.dataPeriod);
    console.log(standingValues);

    for(var i = 0; i < electValues.length; i++) {
        electValues[i] += standingValues[i];
        electValues[i] = roundNumber(electValues[i]);
    }

    return electValues;
}

function gasToPound(house) {
    var gasValues = [];
    for (var i = 0; i < house.gasData.length; i++) {
        gasValues.push(house.gasData[i].consumption * house.tariff.kwhElect);
    }


    return gasValues;
}