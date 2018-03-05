import config from "@/utils/config"
import {
  get,
  post
} from '@/utils/request'

export function getlist(page, size, status, catalogid, keyword, startdate, enddate, orderby) {
  var param = {
    url: config.api.module.article.getmanagelist,
    data: {
      page: page,
      size: size,
      status: status,
      catalogid: catalogid,
      keyword: keyword,
      startdate: startdate,
      enddate: enddate,
      orderby: orderby
    }
  }
  return get(param)
}

export function getsingle(pid) {
  var param = {
    url: config.api.module.article.getsingle,
    data: {
      pid: pid
    }
  }
  return get(param)
}

export function save(pid, title, content, status, tags, uploadImage, catalogid) {
  var param = {
    url: config.api.module.article.save,
    data: {
      pid: pid,
      title: title,
      content: content,
      status: status,
      tags: tags,
      uploadImage: uploadImage,
      catalogid: catalogid
    }
  }
  return post(param)
}

export function deletes(ids) {
  var param = {
    url: config.api.module.article.delete,
    data: {
      ids: ids
    }
  }
  return post(param)
}
