var period = monthly;
var currentProperty;
var scaleTitle = document.getElementById('scaleTitle')

addHousesToNav();

function addHousesToNav () {
    var currentHouse;
    for(var i = 0; i < allHouses.length; i++) {
        document.getElementById('pageNav').innerHTML += '<li onclick="changeProperty('+ allHouses[i].postcode +')">'+allHouses[i].address+'</li>';
    }
}

function changeProperty(newProperty) {
    document.getElementById('graphs').innerHTML = '';
    currentProperty = newProperty;
    console.log(newProperty.address);
}

function changeView(view) {
    if (currentProperty == null) {
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


