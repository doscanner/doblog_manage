const permits = {
  name: 'permission',
  set: function (data) {
    this.clear();
    localStorage.setItem(this.name, JSON.stringify(data));
  },
  get: function () {
    var permissiondata = localStorage.getItem(this.name);
    return (permissiondata != null && permissiondata != undefined && permissiondata != '') ? JSON.parse(permissiondata) : null;
  },
  clear: function () {
    if (this.exist()) {
      localStorage.removeItem(this.name);
    }
  },
  exist: function () {
    var permissiondata = this.get();
    if (permissiondata != null && permissiondata != undefined && permissiondata != '') {
      return true;
    }
    return false;
  }
}
export default permits
