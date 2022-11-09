var currentProperty = '';
var pageHeader = document.getElementById('pageHeader')
var scaleTitle = document.getElementById('scaleTitle')

addHousesToNav();
document.getElementById('scaleButtons').style.display = "none";


for (let i = 0; i <= allHouses.length - 1; i++) {
    allHouses[i].getData(thisMonth, function (house) {
        createStatusBox(i);
    });
}

function addHousesToNav() {
    for (var i = 0; i < allHouses.length; i++) {
        document.getElementById('pageNav').innerHTML += '<li id=' + allHouses[i].postcode + '_nav onclick="changeProperty(' + i + ')">' + allHouses[i].address + '</li>';
    }
}

function changeProperty(id) {
    document.getElementById('graphs').innerHTML = '';
    document.getElementById('buttonHolder').style.display = "none";
    document.getElementById('newHouseForm').style.display = "none";
    document.getElementById('scaleButtons').style.display = "block";

    try {
        document.getElementById(currentProperty.postcode + '_nav').classList.remove("selectedli");
    } catch (err) {
        console.log("Current Property is empty")
    }
    currentProperty = allHouses[id];
    document.getElementById(currentProperty.postcode + '_nav').classList.add("selectedli");
    pageHeader.innerHTML = currentProperty.address;
    addGraphDiv(currentProperty.postcode);
    addGraphDiv("tariffGraph")
    currentProperty.getData(past6Months, function (house) {
        createGasAndElectGraph(house);
    });
    createTariffGraph(currentProperty);
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
    let postcode = document.forms["newHouseForm"]["postcode"].value;
    let address = document.forms["newHouseForm"]["address"].value;
    let mpan = document.forms["newHouseForm"]["mpan"].value;
    let eSerialNum = document.forms["newHouseForm"]["eSerialNum"].value;
    let mprn = document.forms["newHouseForm"]["mprn"].value;
    let gSerialNum = document.forms["newHouseForm"]["gSerialNum"].value;

    saveNewHouse(new House(
        postcode, address,
        FlexOctV2,
        mpan, eSerialNum,
        mprn, gSerialNum
    ))
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

function deleteHouse(i) {
    if (confirm("Delete " + allHouses[i].address + "?")) {
        removeHouseFile(allHouses[i]);
    }
}