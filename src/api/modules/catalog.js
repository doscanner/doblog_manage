import config from "@/utils/config"
import {
  get,
  post
} from '@/utils/request'

export function getlist() {
  var param = {
    url: config.api.module.catalog.getlist,
    data: {}
  }
  return get(param)
}
