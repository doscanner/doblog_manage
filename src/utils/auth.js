const auth = {
  name: 'auth',
  set: function (data) {
    this.clear();
    localStorage.setItem(this.name, JSON.stringify(data));
  },
  get: function () {
    var authdata = localStorage.getItem(this.name);
    return (auth != null && auth != undefined && auth != '') ? JSON.parse(authdata) : null;
  },
  clear: function () {
    if (this.exist()) {
      localStorage.removeItem(this.name);
    }
  },
  exist: function () {
    var auth = this.get();
    if (auth != null && auth != undefined && auth != '')  {
      return true;
    }
    return false;
  }
}
export default auth
