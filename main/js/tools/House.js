const { data } = require("jquery");

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
            jq.ajax
                ({

                    type: "GET",
                    url: urls[i],
                    dataType: 'json',
                    username: "sk_live_wTNi3svVwlDYAA5tdDO22c9X",
                    password: ":",
                    data: {
                        period_from: period.from,
                        group_by: period.group
                    },
                    success: function (res) {
                        console.log(house);
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
                    },
                });
        }

    }

    checkMissingData(res) {
        var expectedData = 0;

        if (this.dataPeriod.group === "hour") {
            return res;
        } else if (this.dataPeriod.group === "day") {
            expectedData = getDaysSince(this.dataPeriod.from)
        } else if (this.dataPeriod.group === "week") {
            expectedData = getMonthsSince(this.dataPeriod.from)
        } else if (this.dataPeriod.group === "month") {
            expectedData = getMonthsSince(this.dataPeriod.from)
        } else {
            return res;
        }


        if (res.length === expectedData) {
            return res;
        } else {
            this.fixMissingData(res, expectedData)
            return res;
        }
    }

    fixMissingData(res, exp) {
        var valuesToAdd = exp - res.length;
        var valuesAdded = 0;

        this.expectedLastData = function () {
            if (this.dataPeriod.group === "hour") { return; }
            else if (this.dataPeriod.group === "day") { return getFullDateYesterday(0); }
            else if (this.dataPeriod.group === "month") { return getFirstDateLastMonth(0); }
            else { return; }
        }

        if (this.expectedLastData() !== res[0].interval_start) {
            res.unshift(new Data(0, this.expectedLastData(), this.expectedLastData()))
            valuesAdded++;
        }

        this.expectedPreviousData = function (num) {
            if (this.dataPeriod.group === "hour") { return; }
            else if (this.dataPeriod.group === "day") { return getFullDateYesterday(num); }
            else if (this.dataPeriod.group === "month") { return getFirstDateLastMonth(num); }
            else { return; }
        }
        
        for (var i = 0; i < exp; i++) {
            if (res[i] == null) {
                res.push(new Data("No Data", this.expectedPreviousData(i), this.expectedPreviousData(i)))
            } else {
                if (res[i].interval_start.slice(0, 10) !== this.expectedPreviousData(i).slice(0,10)) {
                    res.splice(i, 0, new Data(0, this.expectedPreviousData(i), this.expectedPreviousData(i)));
                    valuesAdded++;
                    if (valuesAdded === valuesToAdd) {
                        return;
                    }
                }
            }
        }

    }
}

function Data(consumption, interval_start, interval_end) {
    this.consumption = consumption;
    this.interval_start = interval_start;
    this.interval_end = interval_end;
}

