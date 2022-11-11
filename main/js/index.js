var graphPeriod = {
    group: "month",
    from: getFirstDateLastMonth(1),
    to: getFirstDateLastMonth(0),
}

var responses = 0;

jq("#calendar").submit(function (e) {
    e.preventDefault();
});

function drawAllHousesGraph() {

    console.log(allHouses)

    var dateTimeValues = [];   
     var electricValues = [];

    for(var i = 0; i < allHouses[0].electricData.length; i++) {
        dateTimeValues.push(allHouses[0].electricData[i].interval_start)
    }

    console.log(dateTimeValues)

    var barColors = ["red", "green", "blue", "orange", "brown"];

    new Chart("allHouseUsageGraph", {
        type: "bar",
        data: {
            labels: dateTimeValues,
            datasets: [{
                backgroundColor: gasGraphColor,
                data: electricValues
            }, {
                backgroundColor: electricGraphColor,
                data: electricValues
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
}


function updateAllHousesGraph() {
    let monthFrom = document.forms["calendar"]["monthFrom"].value;
    let yearFrom = document.forms["calendar"]["yearFrom"].value;
    let monthTo = document.forms["calendar"]["monthTo"].value;
    let yearTo = document.forms["calendar"]["yearTo"].value;

    graphPeriod.from = (monthYearToISOFrom(monthFrom, yearFrom))
    graphPeriod.to = (monthYearToISOTo(monthTo, yearTo))
    responses = 0;
    for (var i = 0; i < allHouses.length; i++) {
        allHouses[i].getData(graphPeriod, function (house) {
            responses++;
            console.log(responses)  
            if (responses === allHouses.length) {
                drawAllHousesGraph();
            }
        });
    }

}

