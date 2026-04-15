import "./App.css";
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home"
import Navbar from "./components/common/Navbar"
import OpenRoute from "./components/core/Auth/OpenRoute"

import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Error from "./pages/Error"
import Settings from "./components/core/Dashboard/Settings";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart";
import { ACCOUNT_TYPE } from "./utils/constants";
import AddCourse from "./components/core/Dashboard/AddCourse";
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse"
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails"
import ViewCourse from "./pages/ViewCourse"
import VideoDetails from "./components/core/ViewCourse/VideoDetails"
import Instructor from "./components/core/Dashboard/Instructor"


import RoleGuard from "./components/core/Auth/RoleGuard";

function App() {

  return (
   <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="courses/:courseId" element={<CourseDetails />} />
      <Route path="catalog/:catalogName" element={<Catalog />} />
      <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
    <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />

    <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />  

      <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />  

    <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />  



       {/* Private Route - for Only Logged in User */}
        <Route 
      element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      }
    >
     {/* Route for all users */}

      <Route path="dashboard/my-profile" element={<MyProfile />} />
      <Route path="dashboard/settings" element={<Settings />} />
      
          {/* Route only for Student  */}
          <Route path="dashboard/cart" element={<RoleGuard role={ACCOUNT_TYPE.STUDENT}><Cart /></RoleGuard>} />
          <Route path="dashboard/enrolled-courses" element={<RoleGuard role={ACCOUNT_TYPE.STUDENT}><EnrolledCourses /></RoleGuard>} />

      {/* Route only for Instructor  */}
          <Route path="dashboard/instructor" element={<RoleGuard role={ACCOUNT_TYPE.INSTRUCTOR}><Instructor /></RoleGuard>} />        
          <Route path="dashboard/add-course" element={<RoleGuard role={ACCOUNT_TYPE.INSTRUCTOR}><AddCourse /></RoleGuard>} />
          <Route path="dashboard/my-courses" element={<RoleGuard role={ACCOUNT_TYPE.INSTRUCTOR}><MyCourses/></RoleGuard>} />
          <Route path="dashboard/edit-course/:courseId" element={<RoleGuard role={ACCOUNT_TYPE.INSTRUCTOR}><EditCourse /></RoleGuard>} />
    </Route>

            {/* For the watching course lectures */}
        <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<RoleGuard role={ACCOUNT_TYPE.STUDENT}><VideoDetails /></RoleGuard>}
              />
        </Route>
   
  {/* error 404 */}
    <Route path="*" element={<Error />} />


    </Routes>

   </div>
  );
}

export default App;
