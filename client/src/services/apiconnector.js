import axios from "axios"

export const axiosInstance = axios.create({
    withCredentials: true,
});

const normalizeToken = (rawToken) => {
    if (!rawToken) return null

    let token = rawToken
    try {
        token = JSON.parse(rawToken)
    } catch (_) {
        token = rawToken
    }

    if (typeof token !== "string") {
        return null
    }

    token = token.trim().replace(/^['"]+|['"]+$/g, "")
    while (/^Bearer\s+/i.test(token)) {
        token = token.replace(/^Bearer\s+/i, "").trim()
    }
    token = token.replace(/^['"]+|['"]+$/g, "")

    if (!token || token === "undefined" || token === "null") {
        return null
    }

    return token
}

const isTokenExpired = (token) => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        if (!payload?.exp) return false
        return Date.now() >= payload.exp * 1000
    } catch (_) {
        return true
    }
}

const clearAuthAndRedirect = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    if (window.location.pathname !== "/login") {
        window.location.href = "/login"
    }
}

axiosInstance.interceptors.request.use(
    (config) => {
        const token = normalizeToken(localStorage.getItem("token"))

        if (token && isTokenExpired(token)) {
            clearAuthAndRedirect()
            return Promise.reject(new Error("Session expired"))
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

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status
        const message = error?.response?.data?.message
        const isTokenAuthError =
            message === "Token is missing" ||
            message === "Token is invalid" ||
            message === "Something went wrong while validating the token"

        if (status === 401 && isTokenAuthError) {
            clearAuthAndRedirect()
        }

        return Promise.reject(error)
    }
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