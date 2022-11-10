var periodFrom = getFirstDateLastMonth(1);
var periodTo = getFirstDateLastMonth(0);

console.log(periodFrom)
console.log(periodTo)

$("#calendar").submit(function(e) {
    e.preventDefault();
});

function drawAllHousesGraph() {
    var xValues = ["Italy", "France", "Spain", "USA", "Argentina"];
    var yValues = [55, 49, 44, 24, 15];
    var barColors = ["red", "green", "blue", "orange", "brown"];

    new Chart("allHouseUsageGraph", {
        type: "bar",
        data: {
            labels: xValues,
            datasets: [{
                backgroundColor: barColors,
                data: yValues
            }]
        },
    });
}

drawAllHousesGraph();

function updateAllHousesGraph() {
    let monthFrom = document.forms["calendar"]["monthFrom"].value;
    let yearFrom = document.forms["calendar"]["yearFrom"].value;

    let monthTo = document.forms["calendar"]["monthTo"].value;
    let yearTo = document.forms["calendar"]["yearTo"].value;
    
    console.log(monthTo + yearTo + " " + monthFrom )

}