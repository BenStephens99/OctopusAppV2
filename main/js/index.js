var graphPeriod = {
    group: "month",
    from: getFirstDateLastMonth(6),
    to: getLastDateOfMonth(getFirstDateLastMonth(0)),
}

document.getElementById(getMonthID(graphPeriod.from) + "From").selected = "selected";
document.getElementById(getMonthID(graphPeriod.to) + "To").selected = "selected";

var responses = 0;

jq("#calendar").submit(function (e) {
    e.preventDefault();
});

updateAllHousesGraph() 

function updateAllHousesGraph() {
    let monthFrom = document.forms["calendar"]["monthFrom"].value;
    let yearFrom = document.forms["calendar"]["yearFrom"].value;
    let monthTo = document.forms["calendar"]["monthTo"].value;
    let yearTo = document.forms["calendar"]["yearTo"].value;

    graphPeriod.from = (monthYearToISOFrom(monthFrom, yearFrom))
    graphPeriod.to = (getNextDay(monthYearToISOTo(monthTo, yearTo)))
    drawGraphs();
}

function drawGraphs() {
    console.log(graphPeriod.to)
    document.getElementById("loading").style.display = "block";
    responses = 0;
    document.getElementById("allHouseUsageHolder").innerHTML = '<canvas id="allHouseUsageGraph"></canvas>';

    for (var i = 0; i < allHouses.length; i++) {
        allHouses[i].getData(graphPeriod, function (house) {
            responses++;
            if (responses === allHouses.length) {
                drawAllHousesGraph();
                createPieChart("gas")
            }
        });
    }
}