window.App = window.App || {};

window.App.apiGoranAdapter = {
    baseURL: 'https://apiv2.bitcoinaverage.com/',

    get: function (_endpoint) {
        return App.API.get(_endpoint);
    },

    mapData: function (response, dateLabelFormat) {
        return response.map((_rec) => ({
            value: _rec.average,
            timestamp: dayjs.utc(_rec.time).local().format(dateLabelFormat),
        }));
    },

    _createDateAsUTC: function (date) {
        return new Date(
            Date.UTC(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                date.getHours(),
                date.getMinutes(),
                date.getSeconds()
            )
        );
    },

    getBitcoinRatesForAll: function () {
        return this.get('indices/global/history/BTCUSD?period=alltime&?format=json').then(
            (data) => {
                const nextData = {};

                data.forEach((rec) => {
                    const date = this._createDateAsUTC(new Date(rec.time));

                    const year = date.getFullYear();
                    const key = `${year}`;
                    if (nextData[key]) {
                        nextData[key].average.push(rec.average);
                    } else {
                        nextData[key] = {
                            average: [rec.average],
                            time: date.valueOf(),
                        };
                    }
                });

                const result = [];
                for (let key of Object.keys(nextData)) {
                    result.push(nextData[key]);
                }

                return result.map((rec) => ({
                    average: parseInt(rec.average.reduce((a, b) => a + b) / rec.average.length),
                    time: rec.time,
                }));
            }
        );
    },

    getBitcoinRatesForOneYear: function () {
        return this.get('indices/global/history/BTCUSD?period=alltime&?format=json').then(
            (data) => {
                const nextData = {};

                data.forEach((rec) => {
                    const date = this._createDateAsUTC(new Date(rec.time));
                    const today = new Date();

                    if (today.getFullYear() !== date.getFullYear()) {
                        return;
                    }

                    const month = date.getMonth();
                    const key = `${month}`;
                    if (nextData[key]) {
                        nextData[key].average.push(rec.average);
                    } else {
                        nextData[key] = {
                            average: [rec.average],
                            time: date.valueOf(),
                        };
                    }
                });

                const result = [];
                for (let key of Object.keys(nextData)) {
                    result.push(nextData[key]);
                }

                return result.map((rec) => ({
                    average: parseInt(rec.average.reduce((a, b) => a + b) / rec.average.length),
                    time: rec.time,
                }));
            }
        );
    },

    getBitcoinRatesForOneMonth: function () {
        return this.get('indices/global/history/BTCUSD?period=monthly&?format=json').then(
            (data) => {
                const nextData = {};

                data.forEach((rec) => {
                    const date = this._createDateAsUTC(new Date(rec.time));
                    date.setMinutes(0);
                    date.setHours(0);
                    date.setSeconds(0);

                    const dayOfTheMonth = date.getDate();
                    const month = date.getMonth();
                    const key = `${month}-${dayOfTheMonth}`;
                    if (nextData[key]) {
                        nextData[key].average.push(rec.average);
                    } else {
                        nextData[key] = {
                            average: [rec.average],
                            time: date.valueOf(),
                        };
                    }
                });

                const result = [];
                for (let key of Object.keys(nextData)) {
                    result.push(nextData[key]);
                }

                return result
                    .map((rec) => ({
                        average: parseInt(rec.average.reduce((a, b) => a + b) / rec.average.length),
                        time: rec.time,
                    }))
                    .reverse();
            }
        );
    },

    getBitcoinRatesForOneWeek: function () {
        return this.get('indices/global/history/BTCUSD?period=monthly&?format=json').then(
            (data) => {
                const nextData = {};

                data.forEach((rec) => {
                    const date = this._createDateAsUTC(new Date(rec.time));
                    date.setMinutes(0);
                    date.setHours(0);
                    date.setSeconds(0);

                    const dayOfTheMonth = date.getDate();
                    const month = date.getMonth();
                    const key = `${month}-${dayOfTheMonth}`;
                    if (nextData[key]) {
                        nextData[key].average.push(rec.average);
                    } else {
                        nextData[key] = {
                            average: [rec.average],
                            time: date.valueOf(),
                        };
                    }
                });

                const result = [];
                for (let key of Object.keys(nextData)) {
                    result.push(nextData[key]);
                }

                return result
                    .map((rec) => ({
                        average: parseInt(rec.average.reduce((a, b) => a + b) / rec.average.length),
                        time: rec.time,
                    }))
                    .slice(0, 7)
                    .reverse();
            }
        );
    },

    getBitcoinRatesForOneDay: function () {
        return this.get('indices/global/history/BTCUSD?period=daily&?format=json').then((data) => {
            const nextData = {};

            data.forEach((rec) => {
                const date = this._createDateAsUTC(new Date(rec.time));
                date.setMinutes(0);

                const hour = date.getHours();
                const dayOfTheMonth = date.getDate();
                const key = `${dayOfTheMonth}-${hour}`;

                if (nextData[key]) {
                    nextData[key].average.push(rec.average);
                } else {
                    nextData[key] = {
                        average: [rec.average],
                        time: date.valueOf(),
                    };
                }
            });

            const result = [];
            for (let key of Object.keys(nextData)) {
                result.push(nextData[key]);
            }

            return result
                .map((rec) => ({
                    average: parseInt(rec.average.reduce((a, b) => a + b) / rec.average.length),
                    time: rec.time,
                }))
                .reverse();
        });
    },

    getBitcoinRatesForOneHour: function () {
        return this.get('indices/global/history/BTCUSD?period=daily&?format=json').then((data) => {
            const nextData = [];

            data.forEach((rec) => {
                const date = this._createDateAsUTC(new Date(rec.time));
                const today = new Date();

                const isTheSameDay = today.getDate() === date.getDate();
                const isWithingAnHour = today.valueOf() - date.valueOf() < 60 * 60 * 1000;

                if (isTheSameDay && isWithingAnHour) {
                    nextData.push({
                        average: rec.average,
                        time: date.valueOf(),
                    });
                }
            });

            return nextData.reverse();
        });
    },
};
