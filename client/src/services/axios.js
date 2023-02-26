import axios from "axios";

export const HTTP = axios.create({
  baseURL: process.env.VUE_APP_ENV == "prod" ? `${location.protocol}//${location.hostname}:3030` : process.env.VUE_APP_ROOT_API,
});