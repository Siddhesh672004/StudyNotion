import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"

import {
  getFullDetailsOfCourse,
} from "../../../../services/operations/courseDetailsApi"
import { setCourse, setEditCourse } from "../../../../store/slices/courseSlice"
import RenderSteps from "../AddCourse/RenderSteps"

export default function EditCourse() {
  const dispatch = useDispatch()
  const { courseId } = useParams()
  const { course } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)
  const { token } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!courseId || !token) {
      return
    }

    ;(async () => {
      setLoading(true)
      dispatch(setEditCourse(false))
      dispatch(setCourse(null))

      const result = await getFullDetailsOfCourse(courseId, token)
      const courseDetails =
        result?.courseDetails ||
        result?.data?.courseDetails ||
        result?.course ||
        result?.data?.course ||
        null

      if (courseDetails) {
        dispatch(setEditCourse(true))
        dispatch(setCourse(courseDetails))
      } else if (result?.message) {
        toast.error(result.message)
      }

      setLoading(false)
    })()
  }, [courseId, dispatch, token])

  if (loading) {
    return (
      <div className="grid flex-1 place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">
        Edit Course
      </h1>
      <div className="mx-auto max-w-[600px]">
        {course ? (
          <RenderSteps />
        ) : (
          <p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
            Course not found
          </p>
        )}
      </div>
    </div>
  )
}
