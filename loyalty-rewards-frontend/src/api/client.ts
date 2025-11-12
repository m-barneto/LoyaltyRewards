import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:5223', // change to your backend URL
});
