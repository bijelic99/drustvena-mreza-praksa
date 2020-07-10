import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER_ADDRESS}/api`,
    headers:{
        Authorization: ''
    }
})

var interceptor

const addAuthTokenInterceptor = (token) => {
    if (token)
        interceptor = axiosInstance.interceptors.request.use((response) => {
            response.headers.Authorization = token
            return response
        })
}

const removeAuthTokenInterceptor = () => {
    axiosInstance.interceptors.request.eject(interceptor)
}

export { axiosInstance as axios, addAuthTokenInterceptor, removeAuthTokenInterceptor }
