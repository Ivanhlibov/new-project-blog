import axios from 'axios';

const istanse = axios.create({
    baseURL: 'http://localhost:4444/'
})

istanse.interceptors.request.use((config)=>{
config.headers.Authorization = window.localStorage.getItem('token')
return config
})

export default istanse