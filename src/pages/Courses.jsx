import React, { useContext } from 'react';
import CourseList from '../components/Courses/CourseList';
import { CourseContext } from '../context/CourseContext';
import { Link } from 'react-router-dom';

const Courses = () => {
    const { courses, loading, error } = useContext(CourseContext);

    const openGoogleForms = (e) => {
        e.preventDefault();
        console.log('Abrindo formulário de inscrição...');
        const formsURL = 'https://docs.google.com/forms/d/e/1FAIpQLSfpEZafAY2qE-MsSYQHT7y44hRAmHqXVSEk8cDZEZ0lpxKxrg/viewform';
        
        try {
            window.open(formsURL, '_blank');
        } catch (e) {
            console.error('Erro ao tentar abrir o formulário:', e);
            alert('Não foi possível abrir o formulário. Por favor, verifique se os pop-ups estão permitidos em seu navegador.');
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section - Estilo Apple */}
            <section className="pt-24 pb-16 bg-white overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center text-center mb-16">
                        <span className="text-blue-500 text-sm font-semibold tracking-wide uppercase mb-6">Catálogo de Cursos</span>
                        <h1 className="apple-headline text-gray-900 mb-6 leading-tight">
                            Formação e qualificação<br/>de excelência para socorristas
                        </h1>
                        <p className="apple-subheadline mx-auto mb-8">
                            Conheça nossa variedade de cursos especializados para profissionais que desejam atuar em situações de resgate e emergência.
                        </p>
                        <button 
                            onClick={openGoogleForms}
                            className="btn-primary text-center"
                        >
                            Inscreva-se Agora
                        </button>
                    </div>
                </div>
            </section>

            {/* Courses Section - Estilo Apple */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="text-blue-500 text-sm font-semibold tracking-wide uppercase mb-3 block">Nossos Programas</span>
                        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6">Cursos Disponíveis</h2>
                        <p className="text-xl text-gray-500 max-w-3xl mx-auto">
                            Escolha entre nossos cursos especializados para iniciar ou aprimorar sua carreira como socorrista.
                        </p>
                    </div>
                    
                    {/* Aqui usamos apenas o componente CourseList sem props, ele obtém cursos do contexto */}
                    <CourseList />
                </div>
            </section>

            {/* Call to Action - Estilo Apple */}
            <section className="apple-gradient py-24 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-semibold mb-6">Pronto para iniciar sua formação?</h2>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto mb-10">
                        Inscreva-se em nossos cursos hoje mesmo e dê o próximo passo em sua carreira como socorrista profissional.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            onClick={openGoogleForms}
                            className="bg-white text-blue-600 py-4 px-8 rounded-full text-lg font-medium hover:bg-opacity-90 transition-colors"
                        >
                            Inscreva-se Agora
                        </button>
                        <Link to="/" className="border border-white text-white py-4 px-8 rounded-full text-lg font-medium hover:bg-white hover:bg-opacity-10 transition-colors">
                            Voltar para a Home
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Courses;