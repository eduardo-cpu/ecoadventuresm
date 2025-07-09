import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CourseCard from '../components/Courses/CourseCard';

const Home = () => {
    const navigate = useNavigate();

    // Função otimizada para direcionar para nosso formulário personalizado
    const openRegistrationForm = (e) => {
        e.preventDefault();
        console.log('Abrindo formulário de inscrição personalizado...');
        navigate('/inscricao');
    };

    const handleWhatsApp = () => {
        window.open('https://api.whatsapp.com/send/?phone=55999968205&text&type=phone_number&app_absent=0', '_blank');
    };

    // Dados dos cursos de formação e qualificação de socorristas
    const featuredCourses = [
        {
            id: 1,
            title: "APH",
            description: "Atendimento Pré Hospitalar. Aprenda técnicas avançadas de primeiros socorros e suporte básico de vida para situações de resgate e emergências.",
            image: "https://images.unsplash.com/photo-1587745416684-47953f16f5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
        },
        {
            id: 2,
            title: "APH-P",
            description: "Atendimento Pré Hospitalar Pediátrico. Especialização em técnicas de primeiros socorros para crianças em situações de resgate.",
            image: "https://images.unsplash.com/photo-1581594549595-35f6edc7b762?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
        },
        {
            id: 3,
            title: "APH-T",
            description: "Atendimento Pré Hospitalar Tático. Formação especializada para socorristas que atuam em ambientes hostis e situações de conflito.",
            image: "https://images.unsplash.com/photo-1542884748-2b87b36c6b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
        },
        {
            id: 4,
            title: "SBV",
            description: "Suporte Básico de Vida. Aprenda procedimentos essenciais para socorristas que salvam vidas em situações de emergência cardíaca e respiratória.",
            image: "/sbv.jpeg"
        },
        {
            id: 5,
            title: "RCU",
            description: "Resgate em Conflitos Urbanos. Treinamento especializado para socorristas que atuam em situações de resgate em ambientes urbanos complexos.",
            image: "https://images.unsplash.com/photo-1582502744081-2f45c6d2e4cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
        }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section - Estilo Apple */}
            <section className="pt-24 pb-16 bg-white overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center text-center mb-16">
                        <span className="text-blue-500 text-sm font-semibold tracking-wide uppercase mb-6">Formação Profissional de Socorristas</span>
                        <h1 className="apple-headline text-gray-900 mb-6 leading-tight">
                            Formação e qualificação<br/>de socorristas desde 2005.
                        </h1>
                        <p className="apple-subheadline mx-auto mb-8">
                            Uma das pioneiras no ramo de treinamentos de APH há 20 anos trazendo conhecimento, educação e inovação para a formação de socorristas.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={openRegistrationForm}
                                className="btn-primary text-center"
                            >
                                Inscreva-se Agora
                            </button>
                            <Link to="/courses" className="btn-outline text-center">
                                Conheça nossos cursos
                            </Link>
                        </div>
                    </div>
                    
                    {/* Imagem Hero - Estilo Apple */}
                    <div className="relative h-[500px] rounded-3xl overflow-hidden mx-auto max-w-5xl shadow-2xl">
                        <img 
                            src="/foto%20pagina%20inicial.jpeg" 
                            alt="Equipe EcoAdventure com ambulâncias e bandeiras" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section - Estilo Apple */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-blue-500 text-sm font-semibold tracking-wide uppercase mb-3 block">Por que nos escolher</span>
                        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6">Experiência e tradição</h2>
                        <p className="text-xl text-gray-500 max-w-3xl mx-auto">
                            Fundada em 2005, a Baisch & Oliveira, sob o nome comercial EcoAdventure Cursos e Treinamentos, 
                            é uma das pioneiras no ramo de formação e qualificação de socorristas.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Feature 1 */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-6">
                                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Certificação Reconhecida</h3>
                            <p className="text-gray-500">
                                Nossos certificados são reconhecidos pelas principais instituições de resgate e emergência do país.
                            </p>
                        </div>
                        
                        {/* Feature 2 */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-6">
                                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Abordagem Prática</h3>
                            <p className="text-gray-500">
                                Treinamento hands-on com simulações realistas de situações de resgate e emergência.
                            </p>
                        </div>
                        
                        {/* Feature 3 */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-6">
                                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Instrutores Experientes</h3>
                            <p className="text-gray-500">
                                Equipe de instrutores com experiência real em serviços de resgate e emergência em campo.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cursos Section - Estilo Apple */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-blue-500 text-sm font-semibold tracking-wide uppercase mb-3 block">Nossos Cursos</span>
                        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6">Formação especializada</h2>
                        <p className="text-xl text-gray-500 max-w-3xl mx-auto">
                            Escolha o programa que melhor atende às suas necessidades de formação e qualificação profissional como socorrista.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredCourses.map(course => (
                            <CourseCard 
                                key={course.id} 
                                course={course}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action - Estilo Apple */}
            <section className="apple-gradient py-24 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-semibold mb-6">Comece sua formação hoje</h2>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto mb-10">
                        Inscreva-se em nossos cursos e torne-se um socorrista qualificado. Oferecemos treinamento de alto padrão e certificação reconhecida desde 2005.
                    </p>
                    <button 
                        onClick={openRegistrationForm}
                        className="bg-white text-blue-600 py-4 px-8 rounded-full text-lg font-medium hover:bg-opacity-90 transition-colors"
                    >
                        Inscreva-se Agora
                    </button>
                </div>
            </section>

            {/* Contato Section - Estilo Apple */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <span className="text-blue-500 text-sm font-semibold tracking-wide uppercase mb-3 block">Contato</span>
                            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6">Entre em contato conosco</h2>
                            <p className="text-xl text-gray-500 max-w-3xl mx-auto">
                                Estamos à disposição para esclarecer dúvidas e fornecer mais informações sobre nossos cursos de formação de socorristas.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Contato por Email */}
                            <div className="apple-card hover:-translate-y-1 transition-transform">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Email</h3>
                                <p className="text-gray-500 mb-4">Entre em contato por email:</p>
                                <a 
                                    href="mailto:ecoadventuresm@yahoo.com.br" 
                                    className="text-blue-500 hover:text-blue-700 transition-colors font-medium"
                                >
                                    ecoadventuresm@yahoo.com.br
                                </a>
                            </div>
                            
                            {/* Contato por WhatsApp */}
                            <div className="apple-card hover:-translate-y-1 transition-transform">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-3">WhatsApp</h3>
                                <p className="text-gray-500 mb-4">Fale diretamente conosco:</p>
                                <button 
                                    onClick={handleWhatsApp}
                                    className="btn-primary text-sm py-2 px-5"
                                >
                                    Conversar pelo WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;