import React from "react"
 //Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"
import {  Pagination,FreeMode } from 'swiper/modules'

// Swiper package CSS is omitted because v12 ships nested CSS that triggers CRA build warnings.
// import "../../.."
// Import required modules
//import { FreeMode, Pagination } from "swiper"

// import { getAllCourses } from "../../services/operations/courseDetailsAPI"
//import Course_Card from "./Course_Card"
import CourseCard from "./Course_card"

function CourseSlider({ Courses }) {
  return (
    <>
      {Courses?.length ? (
        <Swiper
          slidesPerView={1}
          spaceBetween={25}
          loop={true}
          pagination={{ clickable: true }}
          modules={[FreeMode, Pagination]}
          breakpoints={{
            1024: {
              slidesPerView: 3,
            },
          }}
          className="max-h-[30rem]"
        >
          {Courses?.map((course, i) => (
            <SwiperSlide key={i}>
              <CourseCard course={course} Height={"h-[250px]"} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-xl text-richblack-5">No Course Found</p>
      )}
    </>
  )
}

export default CourseSlider

// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination } from 'swiper';

// // Import Swiper styles
// import "swiper/css";
// import "swiper/css/pagination";

// // Import your Course_Card component here
// import Course_Card from "./Course_card";

// function Course_Slider({ Courses }) {
//   return (
//     <>
//       {Courses?.length ? (
//         <Swiper
//           slidesPerView={1}
//           spaceBetween={25}
//           loop={true}
//           pagination={{ clickable: true }}
//           breakpoints={{
//             1024: {
//               slidesPerView: 3,
//             },
//           }}
//           className="max-h-[30rem]"
//         >
//           {Courses?.map((course, i) => (
//             <SwiperSlide key={i}>
//               <Course_Card course={course} Height={"h-[250px]"} />
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       ) : (
//         <p className="text-xl text-richblack-5">No Course Found</p>
//       )}
//     </>
//   );
// }

// export default Course_Slider;

