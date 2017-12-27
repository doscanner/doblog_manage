import Qs from 'qs'
import axios from 'axios'
import {
  Loading,
  Message
} from 'element-ui'
import auth from '@/utils/auth'
import config from '@/utils/config'
import util from '@/utils/util'

var service = axios.create({
  baseURL: config.api.url,
  timeout: config.api.timeout,
  transformRequest: [function (data) {
    data = Qs.stringify(data);
    return data;
  }],
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// 添加一个请求拦截器
service.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  Message.error('请求失败:' + error.message);
  return Promise.reject(error);
});

// 添加一个响应拦截器
service.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  Message.error('请求失败:' + error.message);
  return Promise.reject(error);
});

const request = (options) => {
  let opts = {
    //个性化配置
    loading: !util.checkvalue.isnull(options.loading) ? options.loading : true,
    auth: !util.checkvalue.isnull(options.auth) ? options.auth : true,
    timeout: !util.checkvalue.isnull(options.timeout) ? options.timeout : service.defaults.timeout,
    //必须配置
    url: options.url,
    method: options.method,
    baseURL: !util.checkvalue.isnull(options.baseURL) ? options.baseURL : service.defaults.baseURL,
    responseType: !util.checkvalue.isnull(options.responseType) ? options.responseType : config.datatype.json,
  };

  //参数处理
  if (opts.method == config.httpmethod.get) {
    opts.params = options.data;
    opts.headers = !util.checkvalue.isnull(options.headers) ? options.headers : service.defaults.headers.get;
  } else if (opts.method == config.httpmethod.post) {
    opts.data = options.data;
    opts.headers = !util.checkvalue.isnull(options.headers) ? options.headers : service.defaults.headers.post;
    opts.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
  } else {
    alert('不支持' + opts.method + '方法');
  }

  //身份
  if (opts.auth && auth.exist()) {
    var auths = auth.get();
    opts.headers['Authorization'] = 'Bearer ' + auths.access_token;
  }

  var loadingInstance = null;
  if (opts.loading) {
    loadingInstance = Loading.service({
      lock: true,
      text: '加载中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
  }

  let promise = new Promise((resolve, reject) => {
    service(opts).then(response => {
        if (opts.loading) {
          loadingInstance.close();
        }
        var ret = response.data;
        if (!ret.success && ret.status == config.statuscode.unauthorized) {
          Message.error('登录身份已失效，请重新登录');
        }
        resolve(ret);
      }, err => {
        if (opts.loading) {
          loadingInstance.close();
        }
        reject(err);
      })
      .catch((error) => {
        if (opts.loading) {
          loadingInstance.close();
        }
        reject(error);
      })
  })

  return promise
};

export function get(options) {
  options.method = config.httpmethod.get;
  return request(options)
}

export function post(options) {
  options.method = config.httpmethod.post;
  return request(options)
}
