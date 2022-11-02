var currentProperty = '';
var pageHeader = document.getElementById('pageHeader')
var scaleTitle = document.getElementById('scaleTitle')

addHousesToNav();

function addHousesToNav () {
    for(var i = 0; i < allHouses.length; i++) {
        document.getElementById('pageNav').innerHTML += '<li onclick="changeProperty('+ allHouses[i].postcode +')">'+allHouses[i].address+'</li>';
    }
}

function changeProperty(newProperty) {
    currentProperty = newProperty;
    document.getElementById('graphs').innerHTML = '';
    pageHeader.innerHTML = currentProperty.address;
    addGraphDiv(currentProperty);
    currentProperty.getData(monthly, function(house) {
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


