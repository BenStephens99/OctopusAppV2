const FlexOctV2 = {
    productCode: "AFFECT-OCC-VAR-21-10-01",
    tariffCodeE: "E-1R-AFFECT-OCC-VAR-21-10-01-J",
    tariffCodeG: "G-1R-AFFECT-OCC-VAR-21-10-01-J",
}

const BN3_3WQ = new House(
    "BN3_3WQ",
    "88 Clarendon Road",
    FlexOctV2,
    "1900010392943",
    "20J0031061",
    "660235107",
    "E6S10940172161",
);
const Clarendon_Road_88 = [BN3_3WQ];

const BN2_3JB = new House(
    "BN2_3JB",
    "13 Inverness Road",
    FlexOctV2,
    "1900013399835",
    "18P6212993",
    "647710202",
    "G4P62168781800"
);
const Inverness_Road_13 = [BN2_3JB];

const BN1_5DQ = new House(
    "BN1_5DQ",
    "3 Old Shoreham Road",
    FlexOctV2,
    "1900005374710",
    "20J0031284",
    "926182207",
    "G4W00136962127"
);
const Old_Shoreham_Road_3 = [BN1_5DQ];

const BN1_7GD = new House(
    "BN1_7GD",
    "86 Roedale Road",
    FlexOctV2,
    "1900016376895",
    "21J0055783",
    "650347101",
    "G4W00439612127"
);
const Roedale_Road_86 = [BN1_7GD];

const allHouses = [BN3_3WQ, BN2_3JB, BN1_5DQ, BN1_7GD]


function getTariffData() {    
    
    var tariff = FlexOctV2;

    const tariffUrls = {
        elec: "https://api.octopus.energy/v1/products/" + tariff.productCode + "/electricity-tariffs/" + tariff.tariffCodeE + "/standard-unit-rates",
        gas: "https://api.octopus.energy/v1/products/" + tariff.productCode + "/gas-tariffs/" + tariff.tariffCodeG + "/standard-unit-rates",
    }

    $.ajax
        ({
            type: "GET",
            url: tariffUrls.elec,
            async: false,
            dataType: 'json',
            username: "sk_live_wTNi3svVwlDYAA5tdDO22c9X",
            password: ":",
            data: {
                period_from: getFirstDateLastMonth(0),
                period_to: getSecondDateLastMonth(0),
            },
            success: function (res) {
                console.log(res.results[0]);
            }
        })
}
