var graphPeriod = {
    group: "month",
    from: getFirstDateLastMonth(1),
    to: getFirstDateLastMonth(0),
}

jq("#calendar").submit(function (e) {
    e.preventDefault();
});

function drawAllHousesGraph() {
    var dateTimeValues = ["Italy", "France", "Spain", "USA", "Argentina"];
    var electricValues = [55, 49, 44, 24, 15];
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

drawAllHousesGraph();

function updateAllHousesGraph() {
    let monthFrom = document.forms["calendar"]["monthFrom"].value;
    let yearFrom = document.forms["calendar"]["yearFrom"].value;
    let monthTo = document.forms["calendar"]["monthTo"].value;
    let yearTo = document.forms["calendar"]["yearTo"].value;

    graphPeriod.from = (monthYearToISOFrom(monthFrom, yearFrom))
    graphPeriod.to = (monthYearToISOTo(monthTo, yearTo))

    allHouses[0].getData(graphPeriod, function (house) {
        console.log(house)
    });
}