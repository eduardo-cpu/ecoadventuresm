import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourseContext } from '../context/CourseContext';

const CourseDetail = () => {
    const { id } = useParams();
    const { courses } = useCourseContext();
    const navigate = useNavigate();
    
    // Convert string ID from URL params to match the ID type in the courses object
    const course = courses.find(course => course.id === id || course.id === Number(id));

    // Função para abrir o formulário de inscrição personalizado
    const openRegistrationForm = () => {
        navigate('/inscricao');
    };

    if (!course) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">Curso não encontrado</h1>
                <button 
                    onClick={() => navigate('/courses')} 
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                >
                    Voltar para Cursos
                </button>
            </div>
        );
    }

    // Cria uma lista formatada do conteúdo do curso
    const formatDescription = (description) => {
        return description.split(';').map((item, index) => (
            <li key={index} className="mb-2">
                {item.trim()}
            </li>
        ));
    };

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <span className="text-xl font-bold px-4 py-1 bg-blue-100 rounded-full">{course.code}</span>
                </div>
                
                <h1 className="text-3xl font-bold mb-6">{course.title}</h1>
                
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Conteúdo do Curso</h2>
                    <ul className="list-disc pl-6 space-y-1">
                        {formatDescription(course.description)}
                    </ul>
                </div>
                
                <div className="flex flex-wrap gap-4">
                    <button 
                        onClick={() => navigate('/courses')} 
                        className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300"
                    >
                        Voltar para Cursos
                    </button>
                    <button 
                        onClick={openRegistrationForm}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                    >
                        Inscrever-se neste Curso
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;