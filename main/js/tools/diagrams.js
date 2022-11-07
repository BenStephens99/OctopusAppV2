function addGraphDiv(house) {
    document.getElementById('graphs').innerHTML += '<div class="graphContainer"> <canvas id="' + house.postcode + '"></canvas> </div>'
}

Chart.defaults.global.defaultFontColor = "#fff";


function createLineGraph(house) {
    console.log(house);
    const electricGraphColor = "rgba(41, 255, 45, 0.9)";
    const gasGraphColor = "rgba(39, 140, 255, 0.9)";

    var electricValues = electToPound(house);
    var gasValues = gasToPound(house);
    var dateTimeValues = [];

    console.log(electricValues);
    try {
        for (var i = 0; i <= house.electricData.length - 1; i++) {
            dateTimeValues.push(house.electricData[i].interval_start.slice(0, 10));
        }
    } catch (err) {
        console.log("MISSING DATA")
        console.log(house);
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
                        autoSkip: false,
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
                display: false,
                text: house.address,
                fontSize: 16
            },
        }
    });
}

function createStatusBox(house) {
    document.getElementById('graphs').innerHTML += '<div onclick="changeProperty(' + house.postcode + ')" class="statusBox"><h4>' + house.address + '</h4> <div class="dataBox"><p>£' + addAllValues(house.gasData) + '</p><p class="gasCol">Gas:</p></div> <div class="dataBox"><p>£' + addAllValues(house.electricData) + '</p><p class="elecCol">Electric:</p></div></div>'
}
