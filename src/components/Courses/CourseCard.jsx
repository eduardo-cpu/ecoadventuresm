import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] mb-8">
            <div className="relative">
                <img 
                    className="w-full h-56 object-cover" 
                    src={course.image} 
                    alt={course.title} 
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1000&q=80';
                    }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-24"></div>
            </div>
            <div className="px-7 py-6">
                <span className="text-blue-500 text-sm font-semibold tracking-wide uppercase">Formação de Socorristas</span>
                <h2 className="font-semibold text-2xl mt-2 text-gray-900">{course.title}</h2>
                <p className="text-gray-500 mt-3 leading-relaxed text-base line-clamp-3">{course.description}</p>
                
                <div className="mt-6">
                    <Link 
                        to={`/courses/${course.id}`} 
                        className="inline-flex items-center text-blue-500 font-medium"
                    >
                        Saiba mais
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;