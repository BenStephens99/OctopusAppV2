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

        const urls = {
            gas: "https://api.octopus.energy/v1/gas-meter-points/" + this.mprn + "/meters/" + this.gSerialNum + "/consumption/",
            electric: "https://api.octopus.energy/v1/electricity-meter-points/" + this.mpan + "/meters/" + this.eSerialNum + "/consumption/"
        }
        for (let i = 0; i < 2; i++) {
            switch (i) {
                case 0:
                    if (this.mprn != '' && this.gSerialNum != '') {
                        jq.ajax
                            ({
                                type: "GET",
                                url: urls.gas,
                                dataType: 'json',
                                username: apiKey,
                                password: ":",
                                data: {
                                    period_from: period.from,
                                    period_to: period.to,
                                    group_by: period.group
                                },
                                success: function (res) {
                                    recievedGasData = true;
                                    house.gasData = house.checkMissingData(res.results);
                                    if (recievedElectData) {
                                        returnData(house);
                                        return;
                                    }
                                },
                                error: function (err) {
                                    alert(house.address + ": Incorrect Gas Data")
                                    recievedGasData = true;
                                    house.gasData = house.checkMissingData([]);
                                    if (recievedElectData) {
                                        returnData(house);
                                        return;
                                    }
                                }
                            });
                        break;
                    } else {
                        recievedGasData = true;
                        house.gasData = house.checkMissingData([]);
                        if (recievedElectData) {
                            returnData(house);
                            return;
                        }
                        break;
                    }
                case 1:
                    if (this.mpan != '' && this.eSerialNum != '') {
                        jq.ajax
                            ({
                                type: "GET",
                                url: urls.electric,
                                dataType: 'json',
                                username: apiKey,
                                password: ":",
                                data: {
                                    period_from: period.from,
                                    period_to: period.to,
                                    group_by: period.group
                                },
                                success: function (res) {
                                    recievedElectData = true;
                                    house.electricData = house.checkMissingData(res.results);
                                    if (recievedGasData) {
                                        returnData(house);
                                        return;
                                    }
                                },
                                error: function (err) {
                                    alert(house.address + ": Incorrect Gas Data")
                                    recievedElectData = true;
                                    house.electricData = house.checkMissingData([]);
                                    if (recievedGasData) {
                                        returnData(house);
                                        return;
                                    }
                                }
                            });
                        break;
                    } else {
                        recievedElectData = true;
                        house.electricData = house.checkMissingData([]);
                        if (recievedGasData) {
                            returnData(house);
                            return;
                        }
                        break;
                    }
            }
        }
    }

    checkMissingData(res) {
        var expectedData = 0;

        if (res == null) {
            res.push(new Data(0, firstDateOfMonth(this.dataPeriod.to), firstDateOfMonth(this.dataPeriod.to)))
        }

        if (this.dataPeriod.to != null) {
            zeroAllDays(res)
            this.missingDataWithDates(res, getMonthsBetween(this.dataPeriod.from, this.dataPeriod.to) + 1)
            return res;
        } else {
            if (this.dataPeriod.group === "hour") {
                return res;
            } else if (this.dataPeriod.group === "day") {
                expectedData = getDaysSince(this.dataPeriod.from)
            } else if (this.dataPeriod.group === "month") {
                zeroAllDays(res)
                expectedData = getMonthsSince(this.dataPeriod.from)
            } else {
                return res;
            }
        }

        if (res.length === expectedData) {
            return res;
        } else {
            this.missingDataToToday(res, expectedData)
            return res;
        }
    }

    missingDataWithDates(res, exp) {
        if (res.length === 0 || res[0].interval_start.slice(0, 7) !== this.dataPeriod.to.slice(0, 7)) {
            res.unshift(new Data(0, firstDateOfMonth(this.dataPeriod.to), firstDateOfMonth(this.dataPeriod.to)))
        }
        for (var i = 1; i < exp; i++) {
            if (res.length === exp) {
                return;
            } else {
                if (res[i] == null) {
                    res.splice(i, 0, (new Data(0, getMonthBefore(res[i - 1].interval_start), getMonthBefore(res[i - 1].interval_end))))
                } else {
                    if (res[i].interval_start.slice(0, 7) !== getMonthBefore(res[i - 1].interval_start).slice(0, 7)) {
                        res.splice(i, 0, (new Data(0, getMonthBefore(res[i - 1].interval_start), getMonthBefore(res[i - 1].interval_end))));
                    }
                }
            }
        }
    }

    missingDataToToday(res, exp) {

        if (res.length === 0) {
            return;
        }

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
                res.push(new Data(0, this.expectedPreviousData(i), this.expectedPreviousData(i)))
            } else {
                if (res[i].interval_start.slice(0, 10) !== this.expectedPreviousData(i).slice(0, 10)) {
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

