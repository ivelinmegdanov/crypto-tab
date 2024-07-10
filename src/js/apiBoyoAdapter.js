window.App = window.App || {};

window.App.apiBoyoAdapter = {
  baseURL: "http://localhost:3000/v1/",
  currency: "ethereum", // Default currency

  setCurrency: function (currency) {
    this.currency = currency;
  },

  get: function (_endpoint) {
    return App.API.get(`${this.currency}/${_endpoint}`);
  },

  mapData: function (response, dateLabelFormat) {
    return response
      .map((_rec) => ({
        value: _rec.value,
        timestamp: dayjs
          .utc(_rec.timestamp * 1000)
          .local()
          .format(dateLabelFormat),
      }))
      .reverse();
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

  getRatesForAll: function () {
    return this.get("all");
  },

  getRatesForOneYear: function () {
    return this.get("year");
  },

  getRatesForOneMonth: function () {
    return this.get("month");
  },

  getRatesForOneWeek: function () {
    return this.get("week");
  },

  getRatesForOneDay: function () {
    return this.get("day");
  },

  getRatesForOneHour: function () {
    return this.get("hour");
  },

  getRatesNow: function () {
    return this.get("now");
  },
};
