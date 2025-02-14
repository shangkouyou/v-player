import axios from 'axios';
let BASE_URL = '';
if (process.env.IS_ELECTRON) {
  if (process.env.NODE_ENV === 'development') {
    BASE_URL = process.env.VUE_APP_API_DEV_ELECTRON;
  } else {
    BASE_URL = process.env.VUE_APP_API_PRODUCT_ELECTRON;
  }
} else {
  BASE_URL = process.env.VUE_APP_API_DEV_WEB;
}
// create an axios instance
const createRequest = (baseURL, successCode = 'ok', returnOrigin = false) => {
  const service = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 15000, // request timeout
  });

  // request interceptor
  service.interceptors.request.use(
    (config) => {
      // Do something before request is sent
      return config;
    },
    (error) => {
      // Do something with request error
      console.log(error); // for debug
      Promise.reject(error);
    },
  );

  // respone interceptor
  service.interceptors.response.use(
    (response) => {
      const { code, data, status } = response.data;
      if (code === successCode || status === 100) {
        return returnOrigin ? response.data : data;
      } else {
        return Promise.reject(response.data);
      }
    },
    (error) => {
      console.log('err' + error); // for debug
      // Message({message: error, type: 'error'});
      return Promise.reject(error);
    },
  );
  return service;
};

export const musicXhr = createRequest(BASE_URL, 200, true);
