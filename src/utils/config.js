const apiurl = 'http://api.doscanner.cn';
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
    unauthorized: 401
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
    }
  }
};

export default config
