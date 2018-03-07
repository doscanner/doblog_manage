import config from "@/utils/config"
import {
  get,
  post
} from '@/utils/request'

export function getcataloglistbypath(path) {
  var param = {
    url: config.api.module.catalog.getlist,
    data: {
      path: path
    }
  }
  return get(param)
}

export function getmanagelist(path) {
  var param = {
    url: config.api.module.catalog.managelist,
  }
  return get(param)
}

export function update(pid, name, status) {
  var param = {
    url: config.api.module.catalog.update,
    data: {
      pid: pid,
      name: name,
      status: status
    }
  }
  return post(param)
}

export function addchild(parentpath, name, status) {
  var param = {
    url: config.api.module.catalog.addchild,
    data: {
      parentpath: parentpath,
      name: name,
      status: status
    }
  }
  return post(param)
}

export function deletes(pid) {
  var param = {
    url: config.api.module.catalog.delete,
    data: {
      id: pid
    }
  }
  return post(param)
}
