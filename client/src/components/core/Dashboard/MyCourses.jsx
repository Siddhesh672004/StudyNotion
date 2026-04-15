import { VscAdd } from "react-icons/vsc"
import { useNavigate } from "react-router-dom"

import IconBtn from "../../common/IconBtn"
import CoursesTable from "./InstructorCourses/CoursesTable"
import { useInstructorCourses } from "../../../hooks/useInstructorCourses"

export default function MyCourses() {
  const navigate = useNavigate()
  
  const { data: courses, isLoading, isError, refetch } = useInstructorCourses()

  return (
    <div>
      <div className="mb-14 flex items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>
        <IconBtn
          text="Add Course"
          onclick={() => navigate("/dashboard/add-course")}
        >
          <VscAdd />
        </IconBtn>
      </div>

      {isLoading ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : isError ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="flex flex-col items-center gap-4">
            <p className="text-richblack-5">Could not fetch courses. Please try again.</p>
            <button onClick={() => refetch()} className="bg-yellow-50 px-4 py-2 text-black rounded-md font-semibold">
              Retry
            </button>
          </div>
        </div>
      ) : courses?.length === 0 ? (
        <div className="grid h-[10vh] w-full place-content-center text-richblack-5">
          You have not created any courses yet.
        </div>
      ) : (
        <CoursesTable courses={courses} refetch={refetch} />
      )}
    </div>
  )
}
