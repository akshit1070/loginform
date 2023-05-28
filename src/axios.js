import axios from 'axios';
import {baseURL} from './constant';

const instance = axios.create({
    baseURL: baseURL
})

export default instance ;
