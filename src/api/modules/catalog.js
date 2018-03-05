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
