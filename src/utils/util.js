const util = {
  checkvalue: {
    isnull: function (obj) {
      return (null == obj || '' == obj || undefined == obj);
    },
    isint: function (obj) {
      return !isNaN(obj);
    },
    isdate: function (obj) {},
    isfunction: function (callback) {
      return typeof callback === "function";
    }
  }
}

export default util
