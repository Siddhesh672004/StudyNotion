import axios from "axios"

export const axiosInstance = axios.create({
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const rawToken = localStorage.getItem("token")
        let token = null

        if (rawToken) {
            try {
                token = JSON.parse(rawToken)
            } catch (_) {
                token = rawToken
            }
        }

        if (token === "undefined" || token === "null" || token === "") {
            token = null
        }

        if (token) {
            config.headers = config.headers || {}
            if (!config.headers.Authorization) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }

        return config
    },
    (error) => Promise.reject(error)
)

export const apiConnector = (method, url, bodyData, headers, params) => {
    const config = {
        method: `${method}`,
        url: `${url}`,
    }

    if (bodyData !== undefined && bodyData !== null) {
        config.data = bodyData
    }

    if (headers) {
        config.headers = headers
    }

    if (params) {
        config.params = params
    }

    return axiosInstance(config)
}