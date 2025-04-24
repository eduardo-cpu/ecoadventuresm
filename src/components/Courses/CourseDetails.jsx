import React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseDetails = ({ course }) => {
    const navigate = useNavigate();
    
    if (!course) {
        return <div className="text-center">Course not found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="md:flex">
                <div className="md:flex-shrink-0">
                    <img 
                        className="h-64 w-full object-cover md:w-96" 
                        src={course.image} 
                        alt={course.title}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1535957998253-26ae1ef29506?auto=format&fit=crop&w=1000&q=80';
                        }}
                    />
                </div>
                <div className="p-8 w-full">
                    <div className="uppercase tracking-wide text-sm text-green-500 font-semibold">
                        {course.level} • {course.duration}
                    </div>
                    <h2 className="block mt-1 text-2xl leading-tight font-medium text-black">
                        {course.title}
                    </h2>
                    <p className="mt-4 text-gray-600">
                        {course.description}
                    </p>
                    
                    <div className="mt-6">
                        <div className="flex items-center">
                            <div className="text-gray-600">
                                <strong>Instructor:</strong> {course.instructor}
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-6">
                            <span className="text-2xl font-bold text-green-600">${course.price}</span>
                            <div>
                                <button 
                                    onClick={() => navigate('/checkout', { state: { course } })}
                                    className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-300"
                                >
                                    Enroll Now
                                </button>
                                <button 
                                    onClick={() => navigate('/courses')}
                                    className="ml-4 border border-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-100 transition duration-300"
                                >
                                    Back to Courses
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="px-8 pb-8">
                <h3 className="text-xl font-semibold mb-4">What You'll Learn</h3>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Understand key ecological concepts related to {course.title.toLowerCase()}</li>
                    <li>Develop practical skills for environmental conservation</li>
                    <li>Apply sustainable practices in real-world scenarios</li>
                    <li>Contribute to protecting Earth's precious ecosystems</li>
                </ul>
            </div>
        </div>
    );
};

export default CourseDetails;