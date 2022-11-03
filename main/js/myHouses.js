var currentProperty = '';
var pageHeader = document.getElementById('pageHeader')
var scaleTitle = document.getElementById('scaleTitle')

addHousesToNav();

for (var i = 0; i <= allHouses.length - 1; i++) {
    allHouses[i].getData(thisMonth, function(house) {
        createStatusBox(house);
    });
}

function addHousesToNav() {
    for (var i = 0; i < allHouses.length; i++) {
        document.getElementById('pageNav').innerHTML += '<li id=' + allHouses[i].postcode + '_nav onclick="changeProperty(' + allHouses[i].postcode + ')">' + allHouses[i].address + '</li>';
    }
}

function changeProperty(newProperty) {
    try {
        document.getElementById(currentProperty.postcode + '_nav').classList.remove("selectedli");
    } catch (err) {
        console.log("Current Property is empty")
    }
    currentProperty = newProperty;
    document.getElementById('graphs').innerHTML = '';
    document.getElementById(currentProperty.postcode + '_nav').classList.add("selectedli");
    pageHeader.innerHTML = currentProperty.address;
    addGraphDiv(currentProperty);
    currentProperty.getData(past6Months, function (house) {
        createLineGraph(house);
    });
}

function changeView(view) {
    if (currentProperty === null) {
        alert("Select a house");
    } else {
        document.getElementById('graphs').innerHTML = '';
        period = view;
        createGraphs();
    }
}

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


