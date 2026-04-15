import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { FiUsers, FiDollarSign, FiBookOpen } from "react-icons/fi"

import { useInstructorCourses } from "../../../hooks/useInstructorCourses"
import { useInstructorData } from "../../../hooks/useInstructorData"
import InstructorChart from "./InstructorDashboard/InstructorChart"

export default function Instructor() {
  const { user } = useSelector((state) => state.profile)

  const { data: instructorData, isLoading: instructorDataLoading, isError: instructorDataError, refetch: refetchData } = useInstructorData()
  const { data: courses, isLoading: coursesLoading, isError: coursesError, refetch: refetchCourses } = useInstructorCourses()

  const loading = instructorDataLoading || coursesLoading
  const isError = instructorDataError || coursesError

  const handleRetry = () => {
    refetchData()
    refetchCourses()
  }

  const validInstructorData = instructorData?.length ? instructorData : null
  const validCourses = courses || []

  const totalAmount = validInstructorData?.reduce((acc, curr) => acc + curr.totalAmountGenerated, 0) || 0
  const totalStudents = validInstructorData?.reduce((acc, curr) => acc + curr.totalStudentsEnrolled, 0) || 0

  return (
    <div className="animate-fade-in">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold text-richblack-5">Hi {user?.firstName} 👋</h1>
        <p className="font-medium text-richblack-200">Let's start something new</p>
      </div>

      {loading ? (
        <div className="grid min-h-[50vh] place-items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-50"></div>
        </div>
      ) : isError ? (
        <div className="grid min-h-[50vh] place-items-center bg-richblack-800 rounded-xl border border-richblack-700">
          <div className="flex flex-col items-center gap-4 p-8">
            <p className="text-richblack-5">Failed to load instructor data.</p>
            <button onClick={handleRetry} className="bg-yellow-50 px-6 py-2 hover:bg-yellow-100 transition-colors text-black rounded-md font-semibold">Retry</button>
          </div>
        </div>
      ) : validCourses.length > 0 ? (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <p className="text-lg text-richblack-200 font-semibold">Total Courses</p>
                <div className="p-3 rounded-full bg-blue-100 text-blue-500"><FiBookOpen size={20} /></div>
              </div>
              <p className="text-3xl font-bold text-richblack-5">{validCourses.length}</p>
            </div>
            <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <p className="text-lg text-richblack-200 font-semibold">Total Students</p>
                <div className="p-3 rounded-full bg-caribbeangreen-100 text-caribbeangreen-500"><FiUsers size={20} /></div>
              </div>
              <p className="text-3xl font-bold text-richblack-5">{totalStudents}</p>
            </div>
            <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <p className="text-lg text-richblack-200 font-semibold">Total Income</p>
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-500"><FiDollarSign size={20} /></div>
              </div>
              <p className="text-3xl font-bold text-richblack-5">₹{totalAmount}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-xl bg-richblack-800 border border-richblack-700 p-6 min-h-[400px]">
              {totalAmount > 0 || totalStudents > 0 ? (
                <InstructorChart courses={validInstructorData} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-lg font-bold text-richblack-5">No Data to Visualize</p>
                  <p className="mt-2 text-sm text-richblack-300">Wait for student enrollments to generate statistics.</p>
                </div>
              )}
            </div>

            <div className="rounded-xl bg-richblack-800 border border-richblack-700 p-6 flex flex-col col-span-1">
              <div className="flex items-center justify-between mb-6 border-b border-richblack-700 pb-3">
                <p className="text-lg font-bold text-richblack-5">Recent Courses</p>
                <Link to="/dashboard/my-courses" className="text-xs font-semibold text-yellow-50 hover:underline">View All</Link>
              </div>

              <div className="flex flex-col gap-4 flex-1">
                {validCourses.slice(0, 4).map((course) => (
                  <div key={course._id} className="flex gap-3 items-center group">
                    <img
                      src={course.thumbnail}
                      alt={course.courseName}
                      className="h-16 w-24 rounded-lg object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-richblack-5 line-clamp-1 group-hover:text-yellow-50 transition-colors">{course.courseName}</p>
                      <p className="text-xs text-richblack-300 mt-1">
                        <span className={course.status === 'Draft' ? 'text-pink-200' : 'text-caribbeangreen-200'}>
                          {course.status}
                        </span>
                        {' • '}{course.studentsEnrolled?.length || 0} students
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-20 rounded-xl border border-dashed border-richblack-600 bg-richblack-800 p-6 py-20 flex flex-col items-center">
          <p className="text-center text-2xl font-bold text-richblack-5">You haven't created any courses yet</p>
          <p className="text-center text-richblack-200 mt-2">Start sharing your knowledge by creating your first course today.</p>
          <Link to="/dashboard/add-course">
            <button className="mt-6 flex items-center bg-yellow-50 px-6 py-3 text-richblack-900 rounded-md font-bold hover:bg-yellow-100 transition-colors">Create a course</button>
          </Link>
        </div>
      )}
    </div>
  )
}
