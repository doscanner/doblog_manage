import config from "@/utils/config"
import {
  get,
  post
} from '@/utils/request'

export function getlist(page, size, status, keyword, orderby, listtype) {
  var param = {
    url: listtype == 'user' ? config.api.module.user.getuserlist : config.api.module.user.getadminlist,
    data: {
      page: page,
      size: size,
      status: status,
      keyword: keyword,
      orderby: orderby
    }
  }
  return get(param)
}

export function save(id, type, status, account, realname, password, password2, cellphone, email) {
  var param = {
    url: config.api.module.user.save,
    data: {
      id: id,
      type: type,
      status: status,
      account: account,
      realname: realname,
      password: password,
      password2: password2,
      cellphone: cellphone,
      email: email
    }
  }
  return post(param)
}

export function deletes(ids) {
  var param = {
    url: config.api.module.user.delete,
    data: {
      ids: ids
    }
  }
  return post(param)
}

export function getuserinfo(id) {
  var param = {
    url: config.api.module.user.getuserinfo,
    data: {
      userid: id
    }
  }
  return get(param)
}

export function setuserinfo(id, pwd, pwd2, realname, cellphone, email, uploadImage) {
  var param = {
    url: config.api.module.user.setuserinfo,
    data: {
      password: pwd,
      password2: pwd2,
      realname: realname,
      cellphone: cellphone,
      email: email,
      id: id,
      uploadImage: uploadImage,
    }
  }
  return post(param)
}
