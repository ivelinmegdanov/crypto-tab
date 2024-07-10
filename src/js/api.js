window.App = window.App || {};

class API {
  constructor(apiAdapter) {
    this.apiAdapter = apiAdapter;
  }

  get(_endpoint) {
    App.Loader.init();

    return axios
      .get(this.apiAdapter.baseURL + _endpoint)
      .then((r) => r.data)
      .then((r) => {
        App.Message.clear();
        App.Loader.destroy();

        return r;
      });
  }

  mapData(_r, _period) {
    return this.apiAdapter.mapData(_r, _period);
  }

  getRatesForAll() {
    return this.apiAdapter.getRatesForAll();
  }

  getRatesForOneYear() {
    return this.apiAdapter.getRatesForOneYear();
  }

  getRatesForOneMonth() {
    return this.apiAdapter.getRatesForOneMonth();
  }

  getRatesForOneWeek() {
    return this.apiAdapter.getRatesForOneWeek();
  }

  getRatesForOneDay() {
    return this.apiAdapter.getRatesForOneDay();
  }

  getRatesForOneHour() {
    return this.apiAdapter.getRatesForOneHour();
  }

  getRatesNow() {
    return this.apiAdapter.getRatesNow();
  }
}

// window.App.API = new API(App.apiFakeAdapter);
// window.App.API = new API(App.apiGoranAdapter);
// window.App.API = new API(App.apiCecoAdapter);
window.App.API = new API(App.apiBoyoAdapter);
