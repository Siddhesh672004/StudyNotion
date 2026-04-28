import { toast } from "react-hot-toast"

import { apiConnector } from "../apiconnector"
import { catalogData } from "../apis"

export const getCatalogPageData = async (categoryId) => {
  const toastId = toast.loading("Loading...")
  let result = null
  try {
    const response = await apiConnector(
      "POST",
      catalogData.CATALOGPAGEDATA_API,
      {
        categoryId: categoryId,
      }
    )
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Catagory page data.")
    }
    result = response?.data
  } catch (error) {
    console.log("CATALOGPAGEDATA_API API ERROR............", error)
    toast.error(error?.response?.data?.message || error.message)
    result =
      error?.response?.data || {
        success: false,
        data: null,
        message: "Could Not Fetch Category page data.",
      }
  }
  toast.dismiss(toastId)
  return result
}
