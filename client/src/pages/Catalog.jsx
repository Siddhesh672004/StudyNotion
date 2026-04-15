import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiConnector } from '../services/apiconnector';
import { categories, catalogData } from '../services/apis';
import CourseCard from '../components/core/Catalog/Course_card';
import Footer from '../components/common/Footer';

const Catalog = () => {
    const { catalogName } = useParams();
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState('');
    const [loading, setLoading] = useState(true);
    const normalizeCategoryName = (name = '') => name.trim().toLowerCase().replace(/\s+/g, '-');

    // Fetch category ID
    useEffect(() => {
        const getCategories = async () => {
            try {
                const res = await apiConnector("GET", categories.CATEGORIES_API);
                const payload = res?.data?.data;
                const categoryList = Array.isArray(payload)
                    ? payload
                    : Array.isArray(payload?.categories)
                        ? payload.categories
                        : [];

                const category = categoryList.find(
                    (ct) => normalizeCategoryName(ct?.name) === catalogName
                );

                if (category) {
                    setCategoryId(category._id);
                } else {
                    setLoading(false); // category not found
                }
            } catch (error) {
                console.error("Could not fetch categories", error);
                setLoading(false);
            }
        };
        getCategories();
    }, [catalogName]);

    // Fetch Catalog Data
    useEffect(() => {
        const getCategoryDetails = async () => {
            if (!categoryId) return;
            try {
                setLoading(true);
                const res = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API, { categoryId });
                setCatalogPageData(res?.data?.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        getCategoryDetails();
    }, [categoryId]);

    return (
        <div className="bg-brand-dark min-h-screen text-white font-inter">
            {/* Header Section */}
            <div className="bg-brand-surface py-20 px-4">
                <div className="mx-auto box-content w-full max-w-maxContentTab lg:max-w-maxContent text-left pl-[10%] pt-[2%]">
                    <p className="text-sm text-richblack-300 mb-2">Home / Catalog / <span className="text-brand-yellow">{catalogPageData?.selectedCategory?.name || catalogName.replace("-", " ")}</span></p>
                    <h1 className="text-4xl font-semibold mb-4">{catalogPageData?.selectedCategory?.name}</h1>
                    <p className="max-w-[800px] text-richblack-200 text-lg line-clamp-3">
                        {catalogPageData?.selectedCategory?.description}
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="w-11/12 max-w-maxContent mx-auto py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="hidden lg:block lg:col-span-1 rounded-md h-96 bg-brand-surface animate-pulse" />
                        <div className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="flex flex-col gap-3 h-80 bg-brand-surface rounded-xl animate-pulse cursor-pointer">
                                  <div className="w-full h-[200px] bg-brand-card rounded-xl"></div>
                                  <div className="px-3 py-1 flex flex-col gap-1">
                                    <div className="w-3/4 h-5 bg-brand-card rounded"></div>
                                    <div className="w-1/2 h-4 bg-brand-card rounded mt-2"></div>
                                  </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : !catalogPageData?.selectedCategory ? (
                <div className="w-11/12 max-w-maxContent mx-auto py-32 flex flex-col items-center justify-center text-center">
                    <h2 className="text-3xl font-bold mb-4 text-brand-yellow">Uh-oh! Category Not Found</h2>
                    <p className="text-richblack-300 text-lg">We couldn't find the category you're looking for.</p>
                </div>
            ) : (
                <div className="w-11/12 max-w-maxContent mx-auto py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
                        {/* Sidebar / Filters (Static UI for Design System match) */}
                        <div className="hidden lg:block lg:col-span-1 sticky top-24 h-max">
                            <h3 className="text-xl font-semibold mb-6">Filters</h3>
                            <div className="bg-brand-surface rounded-xl p-5 border border-brand-border">
                                <div className="mb-6">
                                    <h4 className="font-semibold text-richblack-100 mb-3">Sort By</h4>
                                    <div className="flex gap-4 border-b border-b-richblack-600 pb-3">
                                        <p className="cursor-pointer">Most Popular</p>
                                        <p className="cursor-pointer">New</p>
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <h4 className="font-semibold text-richblack-100 mb-3">Price Range</h4>
                                    <input type="range" min="0" max="10000" className="w-full accent-brand-yellow" />
                                    <div className="flex justify-between text-xs text-richblack-300 mt-2">
                                        <span>Free</span><span>₹10,000+</span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-richblack-100 mb-3">Rating</h4>
                                    <div className="flex flex-col gap-2">
                                        {['4.5+', '4.0+', '3.0+'].map((rate, i) => (
                                            <label key={i} className="flex gap-2 items-center text-sm text-richblack-200 cursor-pointer">
                                                <input type="radio" name="rating" className="accent-brand-yellow" />
                                                <span>{rate}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Course List */}
                        <div className="col-span-1 lg:col-span-3">
                            <h2 className="text-2xl font-semibold mb-8">Courses to get you started</h2>
                            {catalogPageData?.selectedCategory?.courses?.length === 0 ? (
                                <div className="bg-brand-surface border border-brand-border rounded-xl p-12 text-center flex flex-col items-center justify-center">
                                    <h2 className="text-2xl font-bold mb-2">No Courses Found</h2>
                                    <p className="text-richblack-300 max-w-xs mx-auto">It looks like there are no active courses in this category currently. Try exploring other sections.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {catalogPageData?.selectedCategory?.courses?.map((course, i) => (
                                        <div key={i} className="group transition-all duration-300 hover:shadow-2xl hover:shadow-brand-yellow/10 rounded-xl relative">
                                            <CourseCard course={course} Height={"h-[200px]"} />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {catalogPageData?.differentCategory?.courses?.length > 0 && (
                                <div className="mt-20">
                                    <h2 className="text-2xl font-semibold mb-8">Top courses in {catalogPageData?.differentCategory?.name}</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {catalogPageData?.differentCategory?.courses?.slice(0, 3).map((course, i) => (
                                            <div key={i} className="group transition-all duration-300 hover:shadow-2xl hover:shadow-brand-yellow/10 rounded-xl relative">
                                                <CourseCard course={course} Height={"h-[200px]"} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {catalogPageData?.mostSellingCourses?.length > 0 && (
                                <div className="mt-20">
                                    <h2 className="text-2xl font-semibold mb-8">Frequently Bought</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {catalogPageData?.mostSellingCourses?.slice(0, 3).map((course, i) => (
                                            <div key={i} className="group transition-all duration-300 hover:shadow-2xl hover:shadow-brand-yellow/10 rounded-xl relative">
                                                <CourseCard course={course} Height={"h-[200px]"} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            <Footer />
        </div>
    );
};
export default Catalog;
