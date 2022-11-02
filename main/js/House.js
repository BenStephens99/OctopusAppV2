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

        this.electricData = [];
        this.gasData = [];
    }

    getData(returnData) {
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
                        period_from: "2022-06-01T00:00:00+01:00",
                        order_by: "period",
                        group_by: "month"
                    },
                    success: function (res) {
                        switch (i) {
                            case 0:
                                recievedGasData = true;
                                house.gasData = res.results;
                                if (recievedElectData) {
                                    house.checkMissingData();
                                    returnData(house);
                                    return;
                                } else {
                                    break;
                                }

                            case 1:
                                recievedElectData = true;
                                house.electricData = res.results;
                                if (recievedGasData) {
                                    house.checkMissingData();
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

    checkMissingData() {
        if (this.gasData.length === this.electricData.length) {
            return;
        } else {
            this.handleMissingData();
            return;
        }
    }

    handleMissingData() {
        var missingData;
        var nonMissingData;
        if (this.electricData.length < this.gasData.length) {
            missingData = this.electricData;
            nonMissingData = this.gasData;
        } else {
            missingData = this.gasData;
            nonMissingData = this.electricData;
        }
        missingData.push(new data("No Data", nonMissingData[nonMissingData.length-1].interval_start, nonMissingData[nonMissingData.length-1].interval_end))
        console.log(this)
    }

}
function data(consumption, interval_start, interval_end) {
    this.consumption = consumption;
    this.interval_start = interval_start;
    this.interval_end = interval_end;
}

