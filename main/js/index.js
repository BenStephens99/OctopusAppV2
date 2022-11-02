
for (var i = 0; i <= allHouses.length - 1; i++) {
    document.getElementById('graphs').innerHTML += '<div class="graphContainer"> <canvas id=' + allHouses[i].postcode + '></canvas> </div>'
    allHouses[i].getData(function(output) {
        createLineGraph(output.postcode, output);
    });
}
