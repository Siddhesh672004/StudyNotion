import ProgressBar from "@ramonak/react-progress-bar"
import { useNavigate } from "react-router-dom"
import { useEnrolledCourses } from "../../../hooks/useEnrolledCourses"
import { FiPlayCircle, FiClock, FiCheckCircle } from "react-icons/fi"

export default function EnrolledCourses() {
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useEnrolledCourses()
  const enrolledCourses = data?.filter((ele) => ele.status !== "Draft") || []
  const lastAccessedCourse = enrolledCourses.length > 0 ? enrolledCourses[0] : null;

  return (
    <div className="flex flex-col gap-y-8 animate-fade-in text-richblack-50">
      <header>
        <h1 className="text-3xl font-bold text-richblack-5">Enrolled Courses</h1>
        <p className="text-richblack-300 mt-2">Track your active courses and pick up where you left off.</p>
      </header>
      
      {isLoading ? (
        <div className="grid min-h-[40vh] place-items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-50"></div>
        </div>
      ) : isError ? (
        <div className="grid min-h-[40vh] place-items-center bg-richblack-800 rounded-xl border border-richblack-700">    
          <div className="flex flex-col items-center gap-4 text-center p-8">
            <FiPlayCircle className="text-4xl text-richblack-400" />
            <p className="text-richblack-200">Could not fetch enrolled courses. Please try again.</p>
            <button onClick={() => refetch()} className="bg-yellow-50 px-6 py-2 hover:bg-yellow-100 transition-colors text-black rounded-md font-semibold">
              Retry
            </button>
          </div>
        </div>
      ) : !enrolledCourses.length ? (
        <div className="flex flex-col items-center justify-center h-[30vh] bg-richblack-800 rounded-xl border border-richblack-700">
          <p className="text-richblack-200 text-lg">You haven't enrolled in any courses yet.</p>
          <button onClick={() => navigate("/catalog")} className="mt-4 text-yellow-50 hover:underline">
            Explore Courses
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {lastAccessedCourse && (
            <div className="relative overflow-hidden flex flex-col md:flex-row bg-richblack-800 border border-richblack-700 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-1">
              <div className="md:w-[40%] h-48 md:h-auto overflow-hidden">
                <img 
                  src={lastAccessedCourse.thumbnail} 
                  alt={lastAccessedCourse.courseName}
                  className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-between p-6 md:w-[60%] flex-1 gap-4">
                <div>
                  <span className="bg-yellow-50/20 text-yellow-50 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Continue Learning</span>
                  <h2 className="text-2xl font-bold text-richblack-5 mt-3">{lastAccessedCourse.courseName}</h2>
                  <p className="text-sm text-richblack-300 mt-2 line-clamp-2">
                    {lastAccessedCourse.courseDescription}
                  </p>
                </div>
                
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-medium text-richblack-100">{lastAccessedCourse.progressPercentage || 0}% Completed</span>
                  </div>
                  <ProgressBar
                    completed={lastAccessedCourse.progressPercentage || 0}
                    height="8px"
                    bgColor="#FFD60A"
                    baseBgColor="#2C333F"
                    isLabelVisible={false}
                  />
                  <button 
                    onClick={() => navigate(`/view-course/${lastAccessedCourse._id}/section/${lastAccessedCourse.courseContent?.[0]?._id}/sub-section/${lastAccessedCourse.courseContent?.[0]?.subSection?.[0]?._id}`)}
                    className="mt-2 flex items-center justify-center gap-2 bg-yellow-50 hover:bg-yellow-100 text-richblack-900 font-bold py-3 px-6 rounded-lg transition-all duration-200 w-full md:w-fit"
                  >
                    <FiPlayCircle className="text-xl" />
                    Resume Course
                  </button>
                </div>
              </div>
            </div>
          )}
          <div>
            <h3 className="text-xl font-semibold text-richblack-5 mb-6 border-b border-richblack-700 pb-3">All Enrolled Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {enrolledCourses.map((course, i) => (
                <div
                  key={course._id || i}
                  className="flex flex-col bg-richblack-800 rounded-xl border border-richblack-700 overflow-hidden hover:border-richblack-500 transition-all duration-200 hover:shadow-lg cursor-pointer group"
                  onClick={() => navigate(`/view-course/${course._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`)}
                >
                  <div className="relative h-40 overflow-hidden bg-richblack-900">
                    <img
                      src={course.thumbnail}
                      alt={course.courseName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-yellow-50 text-richblack-900 rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        <FiPlayCircle size={24} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4 p-5 flex-1">
                    <div className="flex-1">
                      <h4 className="font-semibold text-richblack-5 line-clamp-1 group-hover:text-yellow-50 transition-colors">{course.courseName}</h4>
                      <p className="text-xs text-richblack-300 mt-2 line-clamp-2">{course.courseDescription}</p>
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-richblack-700">
                      <div className="flex justify-between items-center text-xs text-richblack-200">
                        <div className="flex items-center gap-1.5 cursor-help" title={`Total duration: ${course.totalDuration}`}>
                          <FiClock /> {course.totalDuration || '0m'}
                        </div>
                        <div className={`flex items-center gap-1.5 ${(course.progressPercentage || 0) === 100 ? 'text-caribbeangreen-200' : ''}`}>
                          {(course.progressPercentage || 0) === 100 && <FiCheckCircle />}
                          {course.progressPercentage || 0}% overall
                        </div>
                      </div>
                      <ProgressBar
                        completed={course.progressPercentage || 0}
                        height="6px"
                        bgColor={(course.progressPercentage || 0) === 100 ? "#05A77B" : "#FFD60A"}
                        baseBgColor="#2C333F"
                        isLabelVisible={false}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
