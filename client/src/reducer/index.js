import {combineReducers} from "@reduxjs/toolkit";

import authReducer from "../store/slices/authSlice"
import profileReducer from "../store/slices/profileSlice";
import cartReducer from "../store/slices/cartSlice"
import courseReducer from "../store/slices/courseSlice"
import viewCourseReducer from "../store/slices/viewCourseSlice"

const rootReducer  = combineReducers({
    auth: authReducer,
    profile:profileReducer,
    cart:cartReducer,
    course:courseReducer,
    viewCourse: viewCourseReducer,
})

export default rootReducer
