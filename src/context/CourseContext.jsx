import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchCourses, addCourse } from '../services/courseService';

export const CourseContext = createContext();

// Mock data para cursos da área da saúde
const MOCK_COURSES = [
    {
        id: "1",
        code: "APH",
        title: "Atendimento Pré Hospitalar",
        shortDescription: "Curso completo de Atendimento Pré Hospitalar com foco em avaliação e tratamento inicial de emergências médicas e trauma.",
        description: "Funcionamento do curso; Pré-teste; Comunicação; Segurança; Biossegurança; Biomecânica do trauma; Avaliação inicial; Hemorragia e choque; Queimadura; Trauma Crânio Encefálico; Trauma Torácico; Trauma Abdominal; Trauma Extremidades; Reanimação Cárdio Pulmonar; Avaliações finais; Aulas Práticas; Simulado de Acidente; Básico de Vida",
        image: "https://images.unsplash.com/photo-1587745416684-47953f16f02f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
        id: "2",
        code: "APHP",
        title: "Atendimento Pré-Hospitalar Pediátrico",
        shortDescription: "Formação especializada em atendimento emergencial para crianças e gestantes em situações de emergência.",
        description: "Avaliação de conhecimentos; Segurança e Biossegurança; Legislação comentada (ECA); Cinemática do trauma; Trauma na Gestação; Parto de emergência; Anatomia infantil; Avaliação inicial; Hemorragias; Ferimentos e choque; Traumas Pediátricos; Acidentes Domésticos; Reanimação Cárdio respiratória; Desobstrução de Via Aérea; Oficinas de RCP E OVACE; oficinas de avaliação inicial; Oficinas de imobilizações; Oficina de estricção com uso do KED Infantil; Avaliação final.",
        image: "https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
        id: "3",
        code: "APH-T",
        title: "Atendimento Pré Hospitalar Tático",
        shortDescription: "Treinamento especializado para profissionais que atuam em situações táticas e de risco.",
        description: "Avaliação inicial da vítima tática; Comunicações em ambiente tático; Triagem em incidentes com múltiplas vítimas; Evacuação tática de feridos; Extração rápida; Tratamento sob fogo; Cuidados táticos em campo; Manejo de vias aéreas em ambiente hostil; Controle de hemorragias táticas; Uso de torniquetes; Cuidados com ferimentos penetrantes; Abordagem MARCH para avaliação tática; Monitoramento de trauma em ambientes remotos; Imobilização e transporte em terreno hostil; Evacuação aeromédica tática; Protocolos de operações especiais; Simulados práticos de resgate tático",
        image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
        id: "4",
        code: "SBV",
        title: "Suporte Básico de Vida",
        shortDescription: "Aprenda técnicas essenciais de Suporte Básico de Vida para adultos e crianças, incluindo o uso do DEA.",
        description: "Suporte Básico de Vida Adulto; Obstrução e desobstrução das vias Aéreas Adulto; Suporte Básico de Vida Pediátrico; Obstrução e desobstrução das vias Aéreas Pediátrico; Uso do desfibrilador externo automático; Matérias utilizados em reanimação cardiopulmonar; Oficina prática do uso do DEA; Oficina prática de reanimação cardiopulmonar adulto; Oficina prática de reanimação cardiopulmonar pediátrico.",
        image: "https://images.unsplash.com/photo-1612531385446-f7e6d131e1d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
        id: "5",
        code: "RCU",
        title: "Resgate em Conflitos Urbanos",
        shortDescription: "Treinamento para resgate e atendimento a vítimas em situações de conflito urbano e ambientes hostis.",
        description: "Avaliação inicial da vítima; suporte básico de vida para adulto; suporte básico de vida em pediatria; hemorragias; queimaduras; imobilizações e transporte; tipos de armamentos mais utilizados; abordagem em ferimentos com arma branca; abordagem em ferimentos com arma de fogo; abordagem em ferimentos com granadas; abordagem em ferimentos com minas; emprego de armas quimicas; emprego de armas biológicas; oficina de RCP; oficinas de imobilização; oficina de transporte de vítimas; oficina de avaliação inicial da vitima; simulação no sand de tiros; avaliação final.",
        image: "https://images.unsplash.com/photo-1542884748-2b87b36c6b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    }
];

// Adding useCourseContext hook to fix import errors in CourseDetail.jsx
export const useCourseContext = () => {
    const context = useContext(CourseContext);
    if (!context) {
        throw new Error('useCourseContext must be used within a CourseProvider');
    }
    return context;
};

export const CourseProvider = ({ children }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCourses = async () => {
            try {
                // Try to fetch from API first
                const fetchedCourses = await fetchCourses();
                // Garantir que fetchedCourses seja um array
                if (fetchedCourses && Array.isArray(fetchedCourses)) {
                    setCourses(fetchedCourses);
                } else {
                    console.warn('API retornou dados inválidos para cursos. Usando dados mockados.');
                    setCourses(MOCK_COURSES);
                }
                setError(null); // Reset any errors if successful
            } catch (err) {
                console.log('Using mock data due to API error:', err.message);
                // Fall back to mock data if API fails
                setCourses(MOCK_COURSES);
                setError(null); // Reset error since we're using mock data as fallback
            } finally {
                setLoading(false);
            }
        };

        loadCourses();
    }, []);

    const registerCourse = async (courseData) => {
        try {
            const newCourse = await addCourse(courseData);
            setCourses((prevCourses) => [...prevCourses, newCourse]);
            return newCourse;
        } catch (err) {
            console.log('Using mock data for new course due to API error:', err.message);
            // Generate mock course with ID
            const mockNewCourse = {
                ...courseData,
                id: `mock-${Date.now()}`,
            };
            setCourses((prevCourses) => [...prevCourses, mockNewCourse]);
            return mockNewCourse;
        }
    };

    return (
        <CourseContext.Provider value={{ 
            courses: Array.isArray(courses) ? courses : [], 
            loading, 
            error, 
            registerCourse 
        }}>
            {children}
        </CourseContext.Provider>
    );
};