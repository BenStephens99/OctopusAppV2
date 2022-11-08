var currentProperty = '';
var pageHeader = document.getElementById('pageHeader')
var scaleTitle = document.getElementById('scaleTitle')

addHousesToNav();

for (var i = 0; i <= allHouses.length - 1; i++) {
    allHouses[i].getData(thisMonth, function (house) {
        createStatusBox(house);
    });
}

function addHousesToNav() {
    for (var i = 0; i < allHouses.length; i++) {
        document.getElementById('pageNav').innerHTML += '<li id=' + allHouses[i].postcode + '_nav onclick="changeProperty(' + i + ')">' + allHouses[i].address + '</li>';
    }
}

function changeProperty(id) {
    try {
        document.getElementById(currentProperty.postcode + '_nav').classList.remove("selectedli");
    } catch (err) {
        console.log("Current Property is empty")
    }
    currentProperty = allHouses[id];
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
function addNewHouse() {
    let postcode = document.forms["newHouseForm"]["fname"].value;
}


var formIsOpen = false;
function showForm() {
    if (formIsOpen === false) {
        document.getElementById("newHouseForm").style.display = "block";
        formIsOpen = true;
    } else {
        document.getElementById("newHouseForm").style.display = "none";
        formIsOpen = false;
    }
}