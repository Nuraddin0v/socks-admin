import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const token1 = JSON.parse(sessionStorage.getItem("dry-fruit"));
const token2 = JSON.parse(localStorage.getItem("dry-fruit"));

const instance = axios.create({
    baseURL: "https://socks-java-app.herokuapp.com/",
    headers: {
        "Content-Type": "application/json",
        "Accept-Language": "uz",
        timeout: 10000,
        Authorization: `Bearer ${token1 || token2}`,
    },
});

const AxiosInterceptor = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const reqInterceptor = (req) => {
            req.headers.Authorization = `Bearer ${token1 || token2}`;
            return req;
        };
        const reqErrInterceptor = (error) => {
            console.log("reqErrInterceptor", error);
            return Promise.reject(error);
        };
        const resInterceptor = (response) => {
            response.headers.Authorization = `Bearer ${token1 || token2}`;
            return response;
        };

        const resErrInterceptor = (error) => {
            console.log("resErrInterceptor", error);
            if (error?.response?.status === 401) {
                console.log(error);
                navigate("/login");
            }

            return Promise.reject(error);
        };

        const reqinterceptor = instance.interceptors.request.use(
            reqInterceptor,
            reqErrInterceptor
        );

        const resinterceptor = instance.interceptors.response.use(
            resInterceptor,
            resErrInterceptor
        );

        return (
            () => instance.interceptors.request.eject(reqinterceptor),
            () => instance.interceptors.response.eject(resinterceptor)
        );
    }, []);

    return children;
};

export default instance;
export { AxiosInterceptor };
