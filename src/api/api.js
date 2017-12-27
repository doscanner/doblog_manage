import config from "@/utils/config"
import {
  get,
  post
} from '@/utils/request'

export function signin(account, password) {
  var param = {
    url: config.api.module.account.signin,
    data: {
      Account: account,
      Password: password
    }
  }
  return post(param)
}