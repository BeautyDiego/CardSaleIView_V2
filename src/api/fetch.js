import { baseUrl,frontWebUrl } from './env'
import Cookies from 'js-cookie'


export default async(url = '', data = {}, type = 'GET', method = 'fetch') => {

  type = type.toUpperCase();
  url = baseUrl + url;
  if (type == 'GET') {
    let dataStr = ''; //数据拼接字符串
    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&';
    })

    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
      url = url + '?' + dataStr;
    }
  }


  if (window.fetch && method == 'fetch') {
    let myHeaders = new Headers();

    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Accept', 'application/json');
    let tokenValue = sessionStorage.getItem("token");
    if (tokenValue){
      myHeaders.append('Authorization', tokenValue);
    }
    let requestConfig = {
      method: type,
      headers: myHeaders,
      mode: "cors",
      cache: "force-cache",
      credentials: 'include'
    }

    if (type == 'POST') {
      Object.defineProperty(requestConfig, 'body', {
        value: JSON.stringify(data)
      })
    }

    try {
      const response = await fetch(url, requestConfig);
      if (response.status === 401){
         alert('用户登录失效，请重新登录！')
        Cookies.remove('user')
        Cookies.remove('roleName')
        Cookies.remove('access')
        Cookies.remove('userId')
        sessionStorage.clear()
          window.location = frontWebUrl
      }
      const responseJson = await response.json();
      return responseJson
    } catch (error) {
      throw new Error(error)
    }
  } else {
    console.log('not support fetch!');
    return new Promise((resolve, reject) => {
      let requestObj;
      if (window.XMLHttpRequest) {
        requestObj = new XMLHttpRequest();
      } else {
        requestObj = new ActiveXObject;
      }

      let sendData = '';
      if (type == 'POST') {
        sendData = JSON.stringify(data);
      }

      requestObj.open(type, url, true);
      requestObj.setRequestHeader("Content-type", "application/json");
      let tokenValue = sessionStorage.getItem("token");
      if (tokenValue){
        requestObj.setRequestHeader("Authorization", tokenValue);
      }
      requestObj.send(sendData);

      requestObj.onreadystatechange = () => {

        if (requestObj.readyState === 4) {
          if (requestObj.status === 401){
            alert('用户登录失效，请重新登录！')
            Cookies.remove('user')
            Cookies.remove('roleName')
            Cookies.remove('access')
            Cookies.remove('userId')
            sessionStorage.clear()
            window.location = frontWebUrl
          }
          if (requestObj.status === 200) {
            let obj = requestObj.response;
            if (typeof obj !== 'object') {
              obj = JSON.parse(obj);
            }
            resolve(obj)
          } else if(requestObj.status === 401){


          }else {

            reject(requestObj)
          }
        }
      }
    })
  }
}
