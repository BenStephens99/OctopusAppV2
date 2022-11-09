const fs = require("fs");
const jq = require("jquery");

const FlexOctV2 = {
    productCode: "AFFECT-OCC-VAR-21-10-01",
    tariffCodeE: "E-1R-AFFECT-OCC-VAR-21-10-01-J",
    tariffCodeG: "G-1R-AFFECT-OCC-VAR-21-10-01-J",
}

const allHouses = [];
const houseDir = './main/houses/';
var h;
const files = fs.readdirSync(houseDir);
for (var i = 0; i < files.length; i++) {
    h = JSON.parse(fs.readFileSync(houseDir + files[i], 'utf8'))
    allHouses.push(new House(
        h.postcode, h.address,
        h.tariff,
        h.mpan, h.eSerialNum,
        h.mprn, h.gSerialNum,
    ))
}

function saveNewHouse(house) {
    fs.writeFileSync(houseDir + house.postcode +'.json', JSON.stringify(house, null, 4));
    location.reload();
}

function removeHouseFile(house) {
    fs.unlinkSync(houseDir + house.postcode +'.json');
    location.reload();
}

function getUnitPriceElect(tariff, period) {
    var dataToReturn;
    jq.ajax
        ({
            type: "GET",
            url: "https://api.octopus.energy/v1/products/" + tariff.productCode + "/electricity-tariffs/" + tariff.tariffCodeE + "/standard-unit-rates",
            async: false,
            dataType: 'json',
            data: {
                period_from: period,
                period_to: getNextDay(period),
            },
            success: function (res) {
                
                dataToReturn = res.results[0].value_exc_vat;
            }
        })
        return dataToReturn / 100;
}

function getStandingPriceElect(tariff, period) {
    var dataToReturn;
    jq.ajax
        ({
            type: "GET",
            url: "https://api.octopus.energy/v1/products/" + tariff.productCode + "/electricity-tariffs/" + tariff.tariffCodeE + "/standing-charges/",
            async: false,
            dataType: 'json',
            data: {
                period_from: period,
                period_to: getNextDay(period),
            },
            success: function (res) {
                dataToReturn = res.results[0].value_exc_vat;
            }
        })
        return dataToReturn / 100;
}

function getUnitPriceGas(tariff, period) {
    var dataToReturn;
    jq.ajax
        ({
            type: "GET",
            url: "https://api.octopus.energy/v1/products/" + tariff.productCode + "/gas-tariffs/" + tariff.tariffCodeG + "/standard-unit-rates",
            async: false,
            dataType: 'json',
            data: {
                period_from: period,
                period_to: getNextDay(period),
            },
            success: function (res) {
                dataToReturn = res.results[0].value_exc_vat;
            }
        })
        return dataToReturn / 100;
}

function getStandingPriceGas(tariff, period) {
    var dataToReturn;
    jq.ajax
        ({
            type: "GET",
            url: "https://api.octopus.energy/v1/products/" + tariff.productCode + "/gas-tariffs/" + tariff.tariffCodeG + "/standing-charges/",
            async: false,
            dataType: 'json',
            data: {
                period_from: period,
                period_to: getNextDay(period),
            },
            success: function (res) {
                dataToReturn = res.results[0].value_exc_vat;
            }
        })
        return dataToReturn / 100;
}