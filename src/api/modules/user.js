import config from "@/utils/config"
import {
  get,
  post
} from '@/utils/request'

export function getadminlist(page, size, status, keyword, orderby) {
  var param = {
    url: config.api.module.user.getadminlist,
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
