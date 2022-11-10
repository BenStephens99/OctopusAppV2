function addGraphDiv(id) {
    document.getElementById('graphs').innerHTML += '<div class="graphContainer"> <canvas id="' + id + '"></canvas> </div>'
}

Chart.defaults.global.defaultFontColor = "#fff";
const electricGraphColor = "rgba(41, 255, 45, 0.9)";
const gasGraphColor = "rgba(39, 140, 255, 0.9)";

function createGasAndElectGraph(house) {
    var electricValues;
    var gasValues;

    if (house.electricData.length !== 0) {
        electricValues = electToPound(house);
    }
    if (house.gasData.length !== 0) {
        gasValues = gasToPound(house);
    }

    var dateTimeValues = [];


    if (house.electricData.length !== 0) {
        for (var i = 0; i <= house.electricData.length - 1; i++) {
            dateTimeValues.push(house.electricData[i].interval_start);
        }

    } else if (house.gasData !== 0) {
        for (var i = 0; i <= house.gasData.length - 1; i++) {
            dateTimeValues.push(house.gasData[i].interval_start);
        }

    }

    try {
        electricValues.reverse();
    } catch (err) {
        console.log("Electric data not available")
    }

    try {
        gasValues.reverse();
    } catch (err) {
        console.log("Gas data not available")
    }

    dateTimeValues = formatDateTimeLables(dateTimeValues, house.dataPeriod.group);
    dateTimeValues.reverse();

    new Chart(house.postcode, {
        type: "line",
        data: {
            labels: dateTimeValues,
            datasets: [{
                label: "Electricity",
                fill: false,
                lineTension: 0,
                backgroundColor: electricGraphColor,
                borderColor: electricGraphColor,
                data: electricValues,
            }, {
                label: "Gas",
                fill: false,
                lineTension: 0,
                backgroundColor: gasGraphColor,
                borderColor: gasGraphColor,
                data: gasValues,
            }]
        },
        options: {
            legend: {
                display: true,
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: '£',
                        fontSize: '16',
                    },
                    ticks: {
                        beginAtZero: true,
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Time / Date',
                        fontSize: '16',
                    }
                }]
            },
            title: {
                display: true,
                text: house.address,
                fontSize: 16
            },
        }
    });
}

function createTariffGraph(house) {

    var dateTimeValues = [];
    var electTariffUnits = [];
    var gasTariffUnits = [];

    var electTariffStandings = [];
    var gasTariffStandings = [];


    if (house.electricData.length !== 0) {
        for (var i = 0; i < house.electricData.length; i++) {
            dateTimeValues.push(house.electricData[i].interval_start)
        }
    } else if (house.gasData.length !== 0) {
        for (var i = 0; i < house.gasData.length; i++) {
            dateTimeValues.push(house.gasData[i].interval_start)
        }
    } else {
        return; //add to this
    }

    if (house.dataPeriod.group === "hour") {

        var electUnitPrice = roundNumber(getUnitPriceElect(house.tariff, dateTimeValues[0]))
        var gasUnitPrice = roundNumber(getUnitPriceGas(house.tariff, dateTimeValues[0]))
        var electStandingPrice = roundNumber(getStandingPriceElect(house.tariff, dateTimeValues[0]))
        var gasStandingPrice = roundNumber(getStandingPriceGas(house.tariff, dateTimeValues[0]))

        for (var i = 0; i < dateTimeValues.length; i++) {
            electTariffUnits.push(roundNumber(electUnitPrice));
            gasTariffUnits.push(roundNumber(gasUnitPrice));
            electTariffStandings.push(roundNumber(electStandingPrice));
            gasTariffStandings.push(roundNumber(gasStandingPrice));

            dateTimeValues[i] = dateTimeValues[i];
        }
    } else {
        for (var i = 0; i < dateTimeValues.length; i++) {
            electTariffUnits.push(roundNumber(getUnitPriceElect(house.tariff, dateTimeValues[i])));
            gasTariffUnits.push(roundNumber(getUnitPriceGas(house.tariff, dateTimeValues[i])));
            electTariffStandings.push(roundNumber(getStandingPriceElect(house.tariff, dateTimeValues[i])));
            gasTariffStandings.push(roundNumber(getStandingPriceGas(house.tariff, dateTimeValues[i])));
            dateTimeValues[i] = dateTimeValues[i];
        }
    }

    dateTimeValues = formatDateTimeLables(dateTimeValues, house.dataPeriod.group);

    dateTimeValues.reverse();
    electTariffUnits.reverse();
    gasTariffUnits.reverse();

    electTariffStandings.reverse();
    gasTariffStandings.reverse();

    new Chart("tariffGraph", {
        type: "line",
        data: {
            labels: dateTimeValues,
            datasets: [{
                label: "Electric per Kwh",
                fill: false,
                lineTension: 0,
                backgroundColor: electricGraphColor,
                borderColor: electricGraphColor,
                data: electTariffUnits,
            }, {
                label: "Gas per KwH",
                fill: false,
                lineTension: 0,
                backgroundColor: gasGraphColor,
                borderColor: gasGraphColor,
                data: gasTariffUnits,
            }, {
                label: "Electric Standing Charge Per Day",
                fill: false,
                lineTension: 0,
                backgroundColor: electricGraphColor,
                borderColor: electricGraphColor,
                borderDash: [10, 5],
                data: electTariffStandings,
            }, {
                label: "Gas Standing Charge Per Day",
                fill: false,
                lineTension: 0,
                backgroundColor: gasGraphColor,
                borderColor: gasGraphColor,
                borderDash: [10, 5],
                data: gasTariffStandings,
            }]
        },
        options: {
            legend: {
                display: true,
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: '£',
                        fontSize: '16',
                    },
                    ticks: {
                        beginAtZero: true,
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Time / Date',
                        fontSize: '16',

                    }
                }]
            },
            title: {
                display: true,
                text: 'This Tariff (' + house.tariff.productCode + ')',
                fontSize: 16
            },
        }
    });
}

function createStatusBox(i) {

    document.getElementById('graphs').innerHTML +=
        '<div class="statusBox">'
        + '<h4>' + allHouses[i].address + '</h4>'
        + '<div class="dataBox"> <p>£' + addAllValues(gasToPound(allHouses[i])) + '</p>'
        + '<p class="gasCol">Gas:</p></div>'
        + '<div class="dataBox"><p>£' + addAllValues(electToPound(allHouses[i])) + '</p>'
        + '<p class="elecCol">Electric:</p></div>' +
        '<button onclick="deleteHouse(' + i + ')" id="deleteButton">Delete</button>'
    '</div>'
}

function formatDateTimeLables(dateTimeValues, periodGroup) {
    var returnValues = [];
    this.formatter = function (value) {
        if (periodGroup === "hour") {
            return nameOfTime(getTimeFromISO(value));
        } else if (periodGroup === "day") {
            return getDayFromISO(value) + "/" + getMonthFromISO(value);
        } else if (periodGroup === "month") {
            return nameOfMonth(getMonthFromISO(value)) + " " + getYearFromISO(value);
        }
    }
    for (var i = 0; i < dateTimeValues.length; i++) {
        returnValues.push(this.formatter(dateTimeValues[i]));
    }
    return returnValues;
}