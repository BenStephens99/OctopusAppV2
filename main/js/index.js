

for (var i = 0; i <= allHouses.length - 1; i++) {
    allHouses[i].getData(hourly, function(house) {
        createStatusBox(house);
    });
}
