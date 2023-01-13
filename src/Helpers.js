import axios from 'axios'

const helpers = {
    authAxios: axios.create({
        //baseURL: "http://localhost:5214/api",
        baseURL: "http://" + window.location.hostname + ":84/api",
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,DELETE',
            'Content-Type': 'application/json'
        }
    }),
    prefixUrl: "/iecescanqr"
    //prefixUrl: ""
}
export default helpers