import React, { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import HighlightText from '../components/core/HomePage/HighlightText';
import CTAButton from '../components/core/HomePage/Button';
import Banner from '../assets/Images/banner.mp4';
import ReviewSlider from '../components/common/ReviewSlider';
import Footer from '../components/common/Footer';
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';

const Home = () => {
    const [catalogData, setCatalogData] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    const toCatalogSlug = (name = "") => name.trim().toLowerCase().replace(/\s+/g, "-");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await apiConnector("GET", categories.CATEGORIES_API);
                const payload = res?.data?.data;
                const categoryList = Array.isArray(payload)
                    ? payload
                    : Array.isArray(payload?.categories)
                        ? payload.categories
                        : [];
                setCatalogData(categoryList);
            } catch (error) {
                console.error("Could not fetch categories", error);
                setCatalogData([]);
            } finally {
                setIsLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="bg-brand-dark min-h-screen font-inter flex flex-col">
            {/* Hero Section */}
            <header className="relative w-11/12 max-w-maxContent mx-auto flex flex-col items-center justify-center text-white pt-24 pb-16">
                <Link to="/signup">
                    <div className="group mx-auto rounded-full bg-brand-surface p-1 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit">
                        <div className="flex flex-row items-center gap-2 rounded-full px-8 py-[6px] transition-all duration-200 group-hover:bg-brand-card">
                            <p>Become an Instructor</p>
                            <FaArrowRight />
                        </div>
                    </div>
                </Link>

                <h1 className="text-center text-4xl lg:text-5xl font-semibold mt-7">
                    Empower Your Future with <HighlightText text="Coding Skills" />
                </h1>

                <p className="mt-6 w-[90%] lg:w-[70%] text-center text-lg text-richblack-300">
                    With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
                </p>

                <div className="flex flex-row gap-7 mt-8">
                    <CTAButton active={true} linkto="/signup">Learn More</CTAButton>
                    <CTAButton active={false} linkto="/login">Book a Demo</CTAButton>
                </div>

                {/* Banner Video */}
                <div className="mx-3 my-12 shadow-[10px_-5px_50px_-5px] shadow-brand-yellow/30">
                    <video className="rounded-md shadow-[20px_20px_0px_0px] shadow-white border-brand-surface" muted loop autoPlay>
                        <source src={Banner} type="video/mp4" />
                    </video>
                </div>
            </header>

            {/* Stats / Value Prop Section */}
            <section className="bg-brand-card w-full py-16">
                <div className="w-11/12 max-w-maxContent mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                    <div className="flex flex-col items-center gap-2">
                        <h2 className="text-3xl font-bold">5K+</h2>
                        <p className="text-richblack-300">Active Students</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <h2 className="text-3xl font-bold">100+</h2>
                        <p className="text-richblack-300">Courses</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <h2 className="text-3xl font-bold">50+</h2>
                        <p className="text-richblack-300">Expert Instructors</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <h2 className="text-3xl font-bold">1M+</h2>
                        <p className="text-richblack-300">Lines of Code</p>
                    </div>
                </div>
            </section>

            {/* Category Grid Section */}
            <section className="w-11/12 max-w-maxContent mx-auto py-20 text-white">
                <h2 className="text-3xl font-semibold text-center mb-10">Explore Top Categories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {isLoadingCategories ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-32 bg-brand-surface rounded-lg animate-pulse" />
                        ))
                    ) : catalogData.length === 0 ? (
                        <div className="col-span-full rounded-lg border border-brand-border bg-brand-surface p-8 text-center">
                            <p className="text-richblack-100">No categories are available right now. Please check back soon.</p>
                        </div>
                    ) : (
                        catalogData.map((category) => (
                            <Link 
                                key={category._id} 
                                to={`/catalog/${toCatalogSlug(category?.name || "")}`}
                                className="bg-brand-surface hover:bg-brand-card border border-brand-border rounded-lg p-6 transition-all duration-200 shadow-sm hover:shadow-brand-yellow/10 hover:-translate-y-1"
                            >
                                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                                <p className="text-richblack-300 text-sm line-clamp-2">{category.description}</p>
                            </Link>
                        ))
                    )}
                </div>
            </section>

            {/* Testimonials */}
            <section className="w-11/12 mx-auto max-w-maxContent py-20 text-white flex flex-col items-center">
                <h2 className="text-center text-3xl font-semibold mb-10">Review from other learners</h2>
                <ReviewSlider />
            </section>

            <Footer />
        </div>
    );
};
export default Home;
