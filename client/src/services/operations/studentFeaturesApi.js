import { toast } from "react-hot-toast"

import { resetCart } from "../../store/slices/cartSlice"
import { setPaymentLoading } from "../../store/slices/courseSlice"
import { apiConnector } from "../apiconnector"
import { studentEndpoints } from "../apis"

const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints

const normalizeToken = (rawToken) => {
  if (!rawToken || typeof rawToken !== "string") return null

  let token = rawToken.trim().replace(/^['"]+|['"]+$/g, "")
  while (/^Bearer\s+/i.test(token)) {
    token = token.replace(/^Bearer\s+/i, "").trim()
  }
  token = token.replace(/^['"]+|['"]+$/g, "")

  if (!token || token === "undefined" || token === "null") return null
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

// Load the Razorpay SDK from the CDN
function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = src
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

// Buy the Course
export async function BuyCourse(
  token,
  courses,
  user_details,
  navigate,
  dispatch
) {
  const toastId = toast.loading("Loading...")
  try {
    const normalizedToken = normalizeToken(token)

    if (!normalizedToken) {
      toast.error("Please login to continue with payment.")
      navigate("/login")
      return
    }

    if (isTokenExpired(normalizedToken)) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      toast.error("Your session expired. Please login again.")
      navigate("/login")
      return
    }

    if (!Array.isArray(courses) || courses.length === 0) {
      toast.error("Please select at least one course to buy.")
      return
    }

    // Loading the script of Razorpay SDK
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

    if (!res) {
      toast.error(
        "Razorpay SDK failed to load. Check your Internet Connection."
      )
      return
    }

    // Initiating the Order in Backend
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      {
        courses,
      },
      {
        Authorization: `Bearer ${normalizedToken}`,
      }
    )

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message)
    }
    console.log("PAYMENT RESPONSE FROM BACKEND............", orderResponse.data)

    const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY
    if (!razorpayKey) {
      toast.error("Razorpay key is missing. Please configure REACT_APP_RAZORPAY_KEY.")
      return
    }

    const configuredLogo = process.env.REACT_APP_RAZORPAY_LOGO_URL
    const checkoutLogo =
      configuredLogo && /^https:\/\//i.test(configuredLogo)
        ? configuredLogo
        : undefined

    // Opening the Razorpay SDK
    const options = {
      key: razorpayKey,
      currency: orderResponse.data.data.currency,
      amount: `${orderResponse.data.data.amount}`,
      order_id: orderResponse.data.data.id,
      name: "StudyNotion",
      description: "Thank you for Purchasing the Course.",
      ...(checkoutLogo ? { image: checkoutLogo } : {}),
      prefill: {
        name: `${user_details?.firstName || ""} ${user_details?.lastName || ""}`.trim(),
        email: user_details?.email || "",
      },
      handler: function (response) {
        sendPaymentSuccessEmail(response, orderResponse.data.data.amount, normalizedToken)
        verifyPayment({ ...response, courses }, normalizedToken, navigate, dispatch)
      },
    }
    const paymentObject = new window.Razorpay(options)

    paymentObject.open()
    paymentObject.on("payment.failed", function (response) {
      toast.error("Oops! Payment Failed.")
      console.log(response.error)
    })
  } catch (error) {
    console.log("PAYMENT API ERROR............", error)
    toast.error(error?.response?.data?.message || "Could not make payment.")
  }
  toast.dismiss(toastId)
}

// Verify the Payment
async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying Payment...")
  dispatch(setPaymentLoading(true))
  try {
    const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
      Authorization: `Bearer ${token}`,
    })                                                  

    console.log("VERIFY PAYMENT RESPONSE FROM BACKEND............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Payment Successful. You are Added to the course ")
    // Navigate to enrolled courses after verification. The list will be refetched there.
    navigate("/dashboard/enrolled-courses", { replace: true })
    dispatch(resetCart())
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR............", error)
    toast.error(error?.response?.data?.message || "Could not verify payment.")
  }
  toast.dismiss(toastId)
  dispatch(setPaymentLoading(false))
}

// Send the Payment Success Email
async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )
  } catch (error) {
    console.log("PAYMENT SUCCESS EMAIL ERROR............", error)
  }
}
