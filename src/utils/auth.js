const auth = {
  name: 'auth',
  set: function (data) {
    this.clear();
    localStorage.setItem(this.name, JSON.stringify(data));
  },
  get: function () {
    var authdata = localStorage.getItem(this.name);
    return (authdata != null &&authdata != undefined && authdata != '') ? JSON.parse(authdata) : null;
  },
  clear: function () {
    if (this.exist()) {
      localStorage.removeItem(this.name);
    }
  },
  exist: function () {
    var authdata = this.get();
    if (authdata != null &&authdata != undefined && authdata != '')  {
      return true;
    }
    return false;
  }
}
export default auth
