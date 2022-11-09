const { copyFileSync } = require("original-fs");

function roundNumber(num) {
    return Math.round(parseFloat(num) * 100) / 100;
}

function addAllValues(values) {
    var returnValue = 0;
    for (var i = 0; i < values.length; i++) {
        returnValue += values[i];
    }
    return roundNumber(returnValue);
}

function electToPound(house) {

    var electValues = [];
    for (var i = 0; i < house.electricData.length; i++) {
        electValues.push(roundNumber(house.electricData[i].consumption * getUnitPriceElect(house.tariff, house.electricData[i].interval_start)));
    }
    var standingValues = [];
    if (house.dataPeriod.group === "day") {
        for (var i = 0; i < electValues.length; i++) {
            standingValues.push(getStandingPriceElect(house.tariff, house.electricData[i].interval_start));
        }
    } else if (house.dataPeriod.group === "week") {
        for (var i = 0; i < electValues.length; i++) {
            standingValues.push(getStandingPriceElect(house.tariff, house.electricData[i].interval_start) * 7);
        }

    } else if (house.dataPeriod.group === "month") {
        for (var i = 0; i < electValues.length - 1; i++) {
            standingValues.push(getStandingPriceElect(house.tariff, house.electricData[i].interval_start) * daysInMonth(getMonthFromISO(house.electricData[i].interval_start)));
        }
        standingValues.push(getStandingPriceElect(house.tariff, house.electricData[electValues.length - 1].interval_start) * (getDayFromISO(house.electricData[electValues.length - 1].interval_end)));
    }

    for (var i = 0; i < electValues.length; i++) {
        electValues[i] += standingValues[i];
        electValues[i] = roundNumber(electValues[i] * 1.05);

    }
    return electValues;
}



function gasToPound(house) {
    var gasValues = [];
    for (var i = 0; i < house.gasData.length; i++) {
        gasValues.push(roundNumber((house.gasData[i].consumption * 1.02264 * 39 / 3.6) * getUnitPriceGas(house.tariff, house.gasData[i].interval_start)));
    }
    var standingValues = [];
    if (house.dataPeriod.group === "day") {
        for (var i = 0; i < gasValues.length; i++) {
            standingValues.push(getStandingPriceGas(house.tariff, house.gasData[i].interval_start));
        }
    } else if (house.dataPeriod.group === "week") {
        for (var i = 0; i < gasValues.length; i++) {
            standingValues.push(getStandingPriceGas(house.tariff, house.gasData[i].interval_start) * 7);
        }

    } else if (house.dataPeriod.group === "month") {
        for (var i = 0; i < gasValues.length - 1; i++) {
            standingValues.push(getStandingPriceGas(house.tariff, house.gasData[i].interval_start) * daysInMonth(getMonthFromISO(house.gasData[i].interval_start)));
        }
        standingValues.push(getStandingPriceGas(house.tariff, house.gasData[gasValues.length - 1].interval_start) * (getDayFromISO(house.gasData[gasValues.length - 1].interval_end)));
    }

    for (var i = 0; i < gasValues.length; i++) {
        gasValues[i] += standingValues[i];
        gasValues[i] = roundNumber(gasValues[i] * 1.05);
    }
    return gasValues;
}