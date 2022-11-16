var currentProperty = '';
var period = pastYear;
var pageHeader = document.getElementById('pageHeader')
var scaleTitle = document.getElementById('scaleTitle')
var responses = 0;
var formIsOpen = false;

addHousesToNav();
document.getElementById('scaleButtons').style.display = "none";

for (let i = 0; i <= allHouses.length - 1; i++) {
    allHouses[i].getData(thisMonth, function (house) {
        createStatusBox(i);
        responses++;
        removeLoading()
    });
}

function removeLoading() {
    if (responses === allHouses.length) {
        document.getElementById("loading").style.display = "none";
    }
}

function addHousesToNav() {
    for (var i = 0; i < allHouses.length; i++) {
        document.getElementById('pageNav').innerHTML += '<li id=' + allHouses[i].postcode + '_nav onclick="changeProperty(' + i + ')">' + allHouses[i].address + '</li>';
    }
}

function changeProperty(id) {
    document.getElementById('buttonHolder').style.display = "none";
    document.getElementById('newHouseForm').style.display = "none";
    document.getElementById('scaleButtons').style.display = "block";

    try {
        document.getElementById(currentProperty.postcode + '_nav').classList.remove("selectedli");
    } catch (err) {
    }

    currentProperty = allHouses[id];
    document.getElementById(currentProperty.postcode + '_nav').classList.add("selectedli");
    pageHeader.innerHTML = currentProperty.address;
    drawGraphs();
}

function drawGraphs() {
    document.getElementById('graphs').innerHTML = '';
    addGraphDiv(currentProperty.postcode);
    addGraphDiv("tariffGraph")
    currentProperty.getData(period, function (house) {
        createGasAndElectGraph(house);
        createTariffGraph(house);
    });
}

function changePeriod(per, id) {
    var selected = document.getElementsByClassName("selectedButton");
    if (selected.length !== 0) {
        selected[0].classList.remove("selectedButton");
    }
    id.classList.add("selectedButton");
    document.getElementById('graphs').innerHTML = '';
    period = per;
    drawGraphs();
}

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function addNewHouse() {
    let postcode = document.forms["newHouseForm"]["postcode"].value;
    let address = document.forms["newHouseForm"]["address"].value;
    let flatNum = document.forms["newHouseForm"]["flatNum"].value;
    let mpan = document.forms["newHouseForm"]["mpan"].value;
    let eSerialNum = document.forms["newHouseForm"]["eSerialNum"].value;
    let mprn = document.forms["newHouseForm"]["mprn"].value;
    let gSerialNum = document.forms["newHouseForm"]["gSerialNum"].value;

    if (flatNum != '' || flatNum != null) {
        address = address + ", Flat " + flatNum;
        postcode = postcode + " F" + flatNum;
    }
    postcode = postcode.replace(/\s+/g, '_');

    saveNewHouse(new House(
        postcode, address,
        FlexOctV2,
        mpan, eSerialNum,
        mprn, gSerialNum
    ))
}

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