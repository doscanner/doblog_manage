const apiurl = 'http://api.doscanner.cn';
// const apiurl = 'http://localhost:21531';
const manageurl = 'http://localhost:8080';
// const apiurl = 'http://127.0.0.1:5003';
// const weburl = 'http://localhost:47016';
// const resurl = 'http://localhost:46940';
const config = {
  api: {
    url: apiurl,
    timeout: 10000,
    module: {
      account: {
        signin: apiurl + '/api/account/adminlogin',
      },
      menu: {
        getlistbyuser: apiurl + '/api/menu/getlistbyuser'
      },
      user: {
        getadminlist: apiurl + '/api/user/adminlist',
        getuserlist: apiurl + '/api/user/userlist',
        save: apiurl + '/api/user/save',
        delete: apiurl + '/api/user/delete',
      }
    }
  },
  manage: {
    url: manageurl,
    module: {
      index: '/',
      login: '/login',
      error: '/error/:code',
      user: {
        list: '/user/list/:listtype'
      }
    }
  },
  // web: {
  //     url: weburl,
  //     module: {
  //     }
  // },
  // res: {
  //     url: resurl,
  //     module: {
  //     }
  // },
  httpmethod: {
    post: 'post',
    get: 'get'
  },
  datatype: {
    json: 'json',
    xml: 'xml',
    html: 'html',
    jsonp: 'jsonp',
    text: 'text'
  },
  statuscode: {
    error: 501,
    unauthorized: 401,
    notfound: 404,
    notpermission: 502
  },
  enums: {
    orderby: {
      asc: {
        key: 'ASC',
        value: 0
      },
      desc: {
        key: 'DESC',
        value: 1
      }
    },
    usertype: {
      ordinary: {
        key: 'ordinary',
        value: 0
      },
      admin: {
        key: 'admin',
        value: 1
      },
      superadmin: {
        key: 'superadmin',
        value: 2
      }
    }
  }
};

export default config
