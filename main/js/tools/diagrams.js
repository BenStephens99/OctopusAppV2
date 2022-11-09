function addGraphDiv(id) {
    document.getElementById('graphs').innerHTML += '<div class="graphContainer"> <canvas id="' + id + '"></canvas> </div>'
}

Chart.defaults.global.defaultFontColor = "#fff";
const electricGraphColor = "rgba(41, 255, 45, 0.9)";
const gasGraphColor = "rgba(39, 140, 255, 0.9)";

function createGasAndElectGraph(house) {
    var electricValues;
    var gasValues;

    if (house.electricData !== 0) {
        electricValues = electToPound(house);
    }
    if (house.gasData.length !== 0) {
        console.log(house.gasData)
        gasValues = gasToPound(house);
    }

    var dateTimeValues = [];

    if (house.electricData != null) {
        for (var i = 0; i <= house.electricData.length - 1; i++) {
            dateTimeValues.push(house.electricData[i].interval_start.slice(0, 10));
        }
    } else if (house.gasData != null) {
        for (var i = 0; i <= house.gasData.length - 1; i++) {
            dateTimeValues.push(house.gasData[i].interval_start.slice(0, 10));
        }
    }

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
    var dateTimeValues = getFirstDateOfLastXMonths(7);
    var electTariffValues = [];
    var gasTariffValues = [];

    dateTimeValues.reverse();

    for (var i = 0; i < dateTimeValues.length; i++) {
        electTariffValues.push(roundNumber(getUnitPriceElect(house.tariff, dateTimeValues[i])));
        gasTariffValues.push(roundNumber(getUnitPriceGas(house.tariff, dateTimeValues[i])));
        dateTimeValues[i] = dateTimeValues[i].slice(0,7);
    }
    
    new Chart("tariffGraph", {
        type: "line",
        data: {
            labels: dateTimeValues,
            datasets: [{
                label: "Electricity",
                fill: false,
                lineTension: 0,
                backgroundColor: electricGraphColor,
                borderColor: electricGraphColor,
                data: electTariffValues,
            }, {
                label: "Gas",
                fill: false,
                lineTension: 0,
                backgroundColor: gasGraphColor,
                borderColor: gasGraphColor,
                data: gasTariffValues,
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
                        labelString: 'Price Per KwH',
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
                text: house.tariff.productCode,
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
