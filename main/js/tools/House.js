class House {
    constructor(
        postcode, address,
        tariff,
        mpan, eSerialNum,
        mprn, gSerialNum,
    ) {
        this.postcode = postcode;
        this.address = address;

        this.tariff = tariff;

        this.mpan = mpan;
        this.eSerialNum = eSerialNum;

        this.mprn = mprn;
        this.gSerialNum = gSerialNum;

        this.dataPeriod;
        this.electricData = [];
        this.gasData = [];
    }

    getData(period, returnData) {
        this.dataPeriod = period;
        let house = this;
        let recievedElectData = false;
        let recievedGasData = false;

        const urls = [
            "https://api.octopus.energy/v1/gas-meter-points/" + this.mprn + "/meters/" + this.gSerialNum + "/consumption/",
            "https://api.octopus.energy/v1/electricity-meter-points/" + this.mpan + "/meters/" + this.eSerialNum + "/consumption/"
        ]

        for (let i = 0; i < urls.length; i++) {
            $.ajax
                ({

                    type: "GET",
                    url: urls[i],
                    dataType: 'json',
                    username: "sk_live_wTNi3svVwlDYAA5tdDO22c9X",
                    password: ":",
                    data: {
                        period_from: period.from,
                        order_by: "period",
                        group_by: period.group
                    },
                    success: function (res) {
                        switch (i) {
                            case 0:
                                recievedGasData = true;
                                house.gasData = house.checkMissingData(res.results);
                                if (recievedElectData) {
                                    returnData(house);
                                    return;
                                } else {
                                    break;
                                }

                            case 1:
                                recievedElectData = true;
                                house.electricData = house.checkMissingData(res.results);
                                if (recievedGasData) {
                                    returnData(house);
                                    return;
                                } else {
                                    break;
                                }
                        }
                    }
                });
        }

    }

    checkMissingData(res) {
        var expectedData = 0;
        if (this.dataPeriod.group === "day") { expectedData = getDaysSince(this.dataPeriod.from) };
        if (this.dataPeriod.group === "month") { expectedData = getMonthsSince(this.dataPeriod.from) };
        if (res.length >= expectedData) {
            return res;
        } else {
            this.fixMissingData(res, expectedData)
            return res;
        }
    }

    fixMissingData(res, exp) {
        console.log(res);
        var valuesToAdd = exp - res.length;
        var valuesAdded = 0;

        this.dateToGet = function (num) {
            if (this.dataPeriod.group === "day") { return getFullDateYesterday(num) }
            if (this.dataPeriod.group === "month") { return getFirstDateLastMonth(num) }
        }
        for (var i = 0; i < exp; i++) {
            if (res[i] != null) {
                if (res[i].interval_start.slice(0, 10) !== this.dateToGet(i).slice(0, 10)) {
                    console.log(this.dateToGet(i).slice(0, 10) + "!=" + res[i].interval_start.slice(0, 10))
                    console.log(i)
                    res.splice(i, 0, new data(0, this.dateToGet(i), this.dateToGet(i)))
                    valuesAdded++;
                    if (valuesAdded >= valuesToAdd) {
                        console.log("all values added")
                        return;
                    }
                }
            } else {
                console.log("extra data")
                res.push(new data(0, this.dateToGet(i), this.dateToGet(i)))
            }
        }
    }
}



function data(consumption, interval_start, interval_end) {
    this.consumption = consumption;
    this.interval_start = interval_start;
    this.interval_end = interval_end;
}

/*
const dummyHouse = {
    data: [
        new data(1, getFullDateYesterday(1), getFullDateYesterday(1)),
        new data(1, getFullDateYesterday(2), getFullDateYesterday(2)),
        new data(1, getFullDateYesterday(4), getFullDateYesterday(4)),
        new data(1, getFullDateYesterday(6), getFullDateYesterday(6)),

    ]
};

function fixData(res, exp) {
    var valuesToAdd = exp - res.length;
    var valuesAdded = 0;
    this.dateToGet = function (num) {
        return getFullDateYesterday(num)
    }
    for (var i = 0; i < exp; i++) {
        if (res[i] != null) {
            if (res[i].interval_start.slice(0, 10) !== this.dateToGet(i).slice(0, 10)) {
                console.log(this.dateToGet(i).slice(0, 10) + "!=" + res[i].interval_start.slice(0, 10))
                console.log(i)
                res.splice(i, 0, new data(0, this.dateToGet(i), this.dateToGet(i)))
                valuesAdded++;
                if (valuesAdded >= valuesToAdd) {
                    console.log("all values added")
                    return;
                }
            }
        } else {
            console.log("extra data")
            res.push(new data(0, this.dateToGet(i), this.dateToGet(i)))
        }
    }
}

fixData(dummyHouse.data, 14);
console.log(dummyHouse.data);
*/