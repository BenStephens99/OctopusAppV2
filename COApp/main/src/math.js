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

var flexOctOct21UnitElect = [];
var flexOctOct21StandingElect = [];

function electToPoundWithTarriffData(house, tariffData) {

    var electValues = [];

    if (house.mpan == '') {
        for (let i = 0; i < house.electricData.length; i++) {
            electValues.push(0)
        }
        return electValues;
    }

    if (house.dataPeriod.group === "hour") {
        var unitPrice = roundNumber(tariffData.electricUnitPrices[0])
        for (var i = 0; i < house.electricData.length; i++) {
            electValues.push(house.electricData[i].consumption * unitPrice);
        }
    } else {
        for (var i = 0; i < house.electricData.length; i++) {
            electValues.push(house.electricData[i].consumption * tariffData.electricUnitPrices[i]);
        }
    }

    var standingValues = [];

    if (house.dataPeriod.group === "hour") {
        var standingPrice = (tariffData.electricStandingPrices[0] / 24)
        for (var i = 0; i < electValues.length; i++) {
            standingValues.push(standingPrice);
        }
    } else if (house.dataPeriod.group === "day") {
        for (var i = 0; i < electValues.length; i++) {
            standingValues.push(tariffData.electricStandingPrices[i]);
        }
    } else if (house.dataPeriod.group === "week") {
        for (var i = 0; i < electValues.length; i++) {
            standingValues.push(tariffData.electricStandingPrices[i] * 7);
        }
    } else if (house.dataPeriod.group === "month") {
        standingValues.push(tariffData.electricStandingPrices[0]) * (getDayFromISO(house.electricData[0].interval_end));
        for (var i = 1; i < electValues.length; i++) {
            standingValues.push(tariffData.electricStandingPrices[0] * daysInMonth(getMonthFromISO(house.electricData[i].interval_start)));
        }
    }

    for (var i = 0; i < electValues.length; i++) {
        electValues[i] += standingValues[i];
        electValues[i] = roundNumber(electValues[i] * 1.05);

    }

    if (house.mpan == '') {
        electValues.forEach(electValue => {
            electValue = 0;
        });
    }

    return electValues;
}

function gasToPoundWithTarriffData(house, tariffData) {

    var gasValues = [];

    if (house.mprn == '') {
        for (let i = 0; i < house.gasData.length; i++) {
            gasValues.push(0)
        }
        return gasValues;
    }


    if (house.dataPeriod.group === "hour") {
        var unitPrice = roundNumber(getUnitPriceGas(house.tariff, house.gasData[0].interval_start))
        for (var i = 0; i < house.gasData.length; i++) {
            gasValues.push((house.gasData[i].consumption * 1.02264 * 39 / 3.6) * unitPrice);
        }
    } else {
        for (var i = 0; i < house.gasData.length; i++) {
            gasValues.push((house.gasData[i].consumption * 1.02264 * 39 / 3.6) * getUnitPriceGas(house.tariff, house.gasData[i].interval_start));
        }
    }

    var standingValues = [];

    if (house.dataPeriod.group === "hour") {
        var standingPrice = (tariffData.gasStandingPrices[0] / 24)
        for (var i = 0; i < gasValues.length; i++) {
            standingValues.push(standingPrice);
        }
    } else if (house.dataPeriod.group === "day") {
        for (var i = 0; i < gasValues.length; i++) {
            standingValues.push(tariffData.gasStandingPrices[i]);
        }
    } else if (house.dataPeriod.group === "week") {
        for (var i = 0; i < gasValues.length; i++) {
            standingValues.push(tariffData.gasStandingPrices[i] * 7);
        }
    } else if (house.dataPeriod.group === "month") {
        standingValues.push(tariffData.gasStandingPrices[0]) * (getDayFromISO(house.gasData[0].interval_end));
        for (var i = 1; i < gasValues.length; i++) {
            standingValues.push(tariffData.gasStandingPrices[0] * daysInMonth(getMonthFromISO(house.gasData[i].interval_start)));
        }
    }

    for (var i = 0; i < gasValues.length; i++) {
        gasValues[i] += standingValues[i];
        gasValues[i] = roundNumber(gasValues[i] * 1.05);

    }

    return gasValues;
}

function electToPound(house) {
    var electValues = [];

    if (house.mpan == '') {
        for (let i = 0; i < house.electricData.length; i++) {
            electValues.push(0)
        }
        return electValues;
    }

    if (house.dataPeriod.group === "hour") {
        var unitPrice = roundNumber(getUnitPriceElect(house.tariff, house.electricData[0].interval_start))
        for (var i = 0; i < house.electricData.length; i++) {
            electValues.push(house.electricData[i].consumption * unitPrice);
        }
    } else {
        for (var i = 0; i < house.electricData.length; i++) {
            electValues.push(house.electricData[i].consumption * getUnitPriceElect(house.tariff, house.electricData[i].interval_start));
        }
    }

    var standingValues = [];

    if (house.dataPeriod.group === "hour") {
        var standingPrice = (getStandingPriceElect(house.tariff, house.electricData[0].interval_start) / 24)
        for (var i = 0; i < electValues.length; i++) {
            standingValues.push(standingPrice);
        }
    } else if (house.dataPeriod.group === "day") {
        for (var i = 0; i < electValues.length; i++) {
            standingValues.push(getStandingPriceElect(house.tariff, house.electricData[i].interval_start));
        }
    } else if (house.dataPeriod.group === "week") {
        for (var i = 0; i < electValues.length; i++) {
            standingValues.push(getStandingPriceElect(house.tariff, house.electricData[i].interval_start) * 7);
        }
    } else if (house.dataPeriod.group === "month") {
        standingValues.push(getStandingPriceElect(house.tariff, house.electricData[0].interval_start) * (getDayFromISO(house.electricData[0].interval_end)));
        for (var i = 1; i < electValues.length; i++) {
            standingValues.push(getStandingPriceElect(house.tariff, house.electricData[i].interval_start) * daysInMonth(getMonthFromISO(house.electricData[i].interval_start)));
        }
    }

    for (var i = 0; i < electValues.length; i++) {
        electValues[i] += standingValues[i];
        electValues[i] = roundNumber(electValues[i] * 1.05);

    }

    if (house.mpan == '') {
        electValues.forEach(electValue => {
            electValue = 0;
        });
    }

    return electValues;
}

function gasToPound(house) {
    var gasValues = [];

    if (house.mprn == '') {
        for (let i = 0; i < house.gasData.length; i++) {
            gasValues.push(0)
        }
        return gasValues;
    }

    if (house.dataPeriod.group === "hour") {
        var unitPrice = roundNumber(getUnitPriceGas(house.tariff, house.gasData[0].interval_start))
        for (var i = 0; i < house.gasData.length; i++) {
            gasValues.push((house.gasData[i].consumption * 1.02264 * 39 / 3.6) * unitPrice);
        }
    } else {
        for (var i = 0; i < house.gasData.length; i++) {
            gasValues.push((house.gasData[i].consumption * 1.02264 * 39 / 3.6) * getUnitPriceGas(house.tariff, house.gasData[i].interval_start));
        }
    }
    var standingValues = [];

    if (house.dataPeriod.group === "hour") {
        const standingPrice = getStandingPriceGas(house.tariff, house.gasData[0].interval_start) / 24;
        for (var i = 0; i < gasValues.length; i++) {
            standingValues.push(standingPrice);
        }
    } else if (house.dataPeriod.group === "day") {
        for (var i = 0; i < gasValues.length; i++) {
            standingValues.push(getStandingPriceGas(house.tariff, house.gasData[i].interval_start));
        }
    } else if (house.dataPeriod.group === "week") {
        for (var i = 0; i < gasValues.length; i++) {
            standingValues.push(getStandingPriceGas(house.tariff, house.gasData[i].interval_start) * 7);
        }

    } else if (house.dataPeriod.group === "month") {
        standingValues.push(getStandingPriceGas(house.tariff, house.gasData[0].interval_start) * (getDayFromISO(house.gasData[0].interval_end)));
        for (var i = 1; i < gasValues.length; i++) {
            standingValues.push(getStandingPriceGas(house.tariff, house.gasData[i].interval_start) * daysInMonth(getMonthFromISO(house.gasData[i].interval_start)));
        }
    }

    for (var i = 0; i < gasValues.length; i++) {
        gasValues[i] += standingValues[i];
        gasValues[i] = roundNumber(gasValues[i] * 1.05);
    }

    if (house.mprn == '') {
        gasValues.forEach(gasValue => {
            gasValue = 0;
        });
    }

    return gasValues;
}
