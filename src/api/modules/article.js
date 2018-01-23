import config from "@/utils/config"
import {
  get,
  post
} from '@/utils/request'

export function getlist(page, size, status, keyword, startdate, enddate, orderby) {
  var param = {
    url: config.api.module.article.getmanagelist,
    data: {
      page: page,
      size: size,
      status: status,
      keyword: keyword,
      startdate: startdate,
      enddate: enddate,
      orderby: orderby
    }
  }
  return get(param)
}

export function save(pid, title, content, status, tags, figurepath, catalogid) {
  var param = {
    url: config.api.module.article.save,
    data: {
      pid: pid,
      title: title,
      content: content,
      status: status,
      tags: tags,
      figurepath: figurepath,
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
