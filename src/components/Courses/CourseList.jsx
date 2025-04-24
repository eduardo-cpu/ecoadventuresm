import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CourseContext } from '../../context/CourseContext';

const CourseCard = ({ course }) => {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            {course.image && (
                <div className="h-48 overflow-hidden">
                    <img 
                        src={course.image} 
                        alt={course.title} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1000&q=80';
                        }}
                    />
                </div>
            )}
            <div className="p-6">
                <span className="text-blue-500 text-sm font-semibold tracking-wide uppercase block mb-2">{course.code}</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{course.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                    {course.shortDescription || course.description.split(';')[0]}
                </p>
                <div className="flex justify-end">
                    <Link 
                        to={`/courses/${course.id}`} 
                        className="inline-block px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
                    >
                        Saber mais
                    </Link>
                </div>
            </div>
        </div>
    );
};

const CourseList = () => {
    const { courses, loading, error } = useContext(CourseContext);
    
    console.log("Cursos no CourseList:", courses); // Para debug

    if (loading) {
        return (
            <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
                <p className="mt-3 text-gray-600">Carregando cursos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 bg-red-50 rounded-xl p-6">
                <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-600">Erro ao carregar cursos: {error}</p>
                <p className="mt-2 text-gray-500">Por favor, tente novamente mais tarde.</p>
            </div>
        );
    }

    // Verificação explícita se courses é um array
    if (!courses || !Array.isArray(courses) || courses.length === 0) {
        return (
            <div className="text-center py-10 bg-yellow-50 rounded-xl p-6">
                <svg className="w-12 h-12 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg text-gray-700">Nenhum curso disponível no momento.</p>
                <p className="mt-2 text-gray-500">Por favor, retorne em breve ou entre em contato para mais informações.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(course => (
                <CourseCard key={course.id} course={course} />
            ))}
        </div>
    );
};

export default CourseList;