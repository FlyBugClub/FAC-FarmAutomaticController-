import  axios from './customize-axios'; //aka import  axios from 'axios';

const fetchOneUser = () => {
    return axios.get('/account')

} 
export {fetchOneUser}
