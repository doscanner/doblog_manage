const util = {
  checkvalue: {
    isnull: function (obj) {
      // if (obj == null || undefined == obj) {
      //   return true;
      // } else {
      //   if (typeof (obj) == 'number') {
      //     return false;
      //   } else {
      //     return (null == obj || '' == obj || undefined == obj);
      //   }
      // }
      return (null == obj || '' == obj || undefined == obj);
    },
    isfunction: function (callback) {
      return typeof callback === "function";
    },
    isdate: function (obj) {
      return obj.match(/^(\d{4})[-\/](\d{1}|0\d{1}|1[0-2])([-\/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/);
    },
    isphone: function (obj) {
      return obj.match(/^1\d{10}$/);
    },
    isemail: function (obj) {
      return obj.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);
    },
    isurl: function (obj) {
      return obj.match(/(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/);
    },
    isint: function (obj) {
      return !isNaN(obj);
    },
    isnumber: function (obj) {
      return obj.match(/^\d+$/);
    },
    isidentity: function (obj) {
      return obj.match(/(^\d{15}$)|(^\d{17}(x|X|\d)$)/);
    }
  }
}

export default util
