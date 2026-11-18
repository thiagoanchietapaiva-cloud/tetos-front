import { Navigate } from "react-router";
import { AXIOS } from "../services";
import { useContext } from "react";
import { AdminContext } from "../contexts/AdminProvider";

const RotaProtegida = ({ children }) => {

    const { token, logout } = useContext(AdminContext);

    AXIOS.interceptors.request.use(
        function (config) {
            config.headers.Authorization = `Bearer ${token}`
            return config;
        },
        function (error) {
            return Promise.reject(error);
        }
    );

    // Add a response interceptor
    AXIOS.interceptors.response.use(
        function (response) {
            // Any status code that lie within the range of 2xx cause this function to trigger
            // Do something with response data
            return response;
        },
        function (error) {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            // Do something with response error
            if(error.status == 401){
                logout();
            }
            return Promise.reject(error);
        }
    );

    return token ? children : <Navigate to="/" />
}

export default RotaProtegida;