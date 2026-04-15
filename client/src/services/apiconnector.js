import axiosInstance from "./axiosInstance"

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
