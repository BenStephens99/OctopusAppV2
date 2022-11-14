function addGraphDiv(id) {
    document.getElementById('graphs').innerHTML += '<div class="graphContainer"> <canvas id="' + id + '"></canvas> </div>'
}

Chart.defaults.global.defaultFontColor = "#fff";

const electBackgroudColor = "rgba(41, 255, 45, 0.4)";
const electBorderColor = "rgba(41, 255, 45, 1)";

const gasBackgroundColor = "rgba(39, 140, 255, 0.4)";
const gasBorderColor = "rgba(39, 140, 255, 1)";

function createGasAndElectGraph(house) {
    console.log(house)
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
                backgroundColor: electBorderColor,
                borderColor: electBackgroudColor,
                data: electricValues,
            }, {
                label: "Gas",
                fill: false,
                lineTension: 0,
                backgroundColor: gasBorderColor,
                borderColor: gasBackgroundColor,
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
                backgroundColor: electBorderColor,
                borderColor: electBackgroudColor,
                data: electTariffUnits,
            }, {
                label: "Gas per KwH",
                fill: false,
                lineTension: 0,
                backgroundColor: gasBorderColor,
                borderColor: gasBackgroundColor,
                data: gasTariffUnits,
            }, {
                label: "Electric Standing Charge Per Day",
                fill: false,
                lineTension: 0,
                backgroundColor: electBorderColor,
                borderColor: electBackgroudColor,
                borderDash: [10, 5],
                data: electTariffStandings,
            }, {
                label: "Gas Standing Charge Per Day",
                fill: false,
                lineTension: 0,
                backgroundColor: gasBorderColor,
                borderColor: gasBackgroundColor,
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

function drawAllHousesGraph() {

    var dateTimeValues = [];
    var electricValues = [];
    var gasValues = [];

    for (var i = 0; i < allHouses[0].electricData.length; i++) {
        dateTimeValues.push(
            nameOfMonth(getMonthFromISO(allHouses[0].electricData[i].interval_start)) + " " +
            getYearFromISO(allHouses[0].electricData[i].interval_start));
        electricValues.push(0);
        gasValues.push(0);
    }

    for (var j = 0; j < allHouses.length; j++) {
        console.log(allHouses[j])
        for (var i = 0; i < dateTimeValues.length; i++) {
            electricValues[i] = roundNumber(electricValues[i] + electToPound(allHouses[j])[i]);
            gasValues[i] = roundNumber(gasValues[i] + gasToPound(allHouses[j])[i]);
        }
    }

    dateTimeValues.shift()
    electricValues.shift()
    gasValues.shift()

    dateTimeValues.reverse()
    electricValues.reverse()
    gasValues.reverse()

    var barColors = ["red", "green", "blue", "orange", "brown"];

    new Chart("allHouseUsageGraph", {
        type: "bar",
        data: {
            labels: dateTimeValues,
            datasets: [{
                label: "Electricity",
                backgroundColor: electBackgroudColor,
                borderColor: electBorderColor,
                borderWidth: 3,
                data: electricValues,
            }, {
                label: "Gas",
                backgroundColor: gasBackgroundColor,
                borderColor: gasBorderColor,
                borderWidth: 3,
                data: gasValues,
            }]
        }, options: {
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true
                }]
            }
        }
    });

    document.getElementById("loading").style.display = "none";

}

function createPieChart(dataType) {

    var houseNames = [];
    var graphValues = [];

    if (dataType === "gas") {
        allHouses.forEach(house => {
            houseNames.push(house.address)
            graphValues.push(addAllValues(gasToPound(house)))
        });
    } else if (dataType === "electric") {
        allHouses.forEach(house => {
            houseNames.push(house.address)
            graphValues.push(addAllValues(electToPound(house)))
        });
    }

    var barColors = [
        "#003f5c",
        "#2f4b7c",
        "#665191",
        "#a05195",
        "#d45087",
        "#f95d6a",
        "#ff7c43",
        "#ffa600"
    ]

    new Chart(dataType + "PieChart", {
        type: "pie",
        data: {
            labels: houseNames,
            datasets: [{
                backgroundColor: barColors,
                data: graphValues
            }]
        },
        options: {
            title: {
                display: true,
                text: capitaliseFirstLetter(dataType)
            }
        }
    });
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

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}