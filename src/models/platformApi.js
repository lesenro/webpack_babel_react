import request from '../utils/request';
import { AppTools } from '../utils/utils';
import globalStore from './global';
const apiUrl = globalStore.appCfg.ApiUrl|| "";

// 登录
// username,password
export async function oauthToken(params) {
  const data = Object.assign({}, params);
  return request(`${apiUrl}/login`, {
    method: 'POST',
    body: {
      ...data,
    },
  }).then(resp => {
    if (resp.access_token) {
      AppTools.AccessToken(resp.access_token);
    }
    return resp;
  });
}
// 登出
export async function logout() {
  return request(`${apiUrl}/logout`, {
    method: 'GET',
  }).then(resp => {
    if (resp.code === 0) {
      AppTools.RemoveToken();
    }
    return resp;
  });
}

// 获取图型验证码
// data:image/png;base64,
export async function getCodeImg() {
  const rnd = (new Date()).getTime().toString();
  const url = `/code/img?${rnd}`;
  return request(apiUrl + url, {
    method: 'GET',
  });

}

