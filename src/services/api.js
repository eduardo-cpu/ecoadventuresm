import axios from 'axios';

// Mock data para cursos (sincronizado com CourseContext.jsx)
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
        description: "Em breve será disponibilizado o conteúdo programático deste curso.",
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

// API simulada com promessas para simular chamadas assíncronas
const simulateApiCall = (data, delay = 500) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ data }), delay);
    });
};

// Funções de API que agora usam dados mockados
export const registerUser = async (userData) => {
    try {
        // Simulando chamada à API
        const response = await simulateApiCall({ success: true, user: userData });
        return response.data;
    } catch (error) {
        throw { message: 'Erro ao registrar usuário' };
    }
};

export const loginUser = async (credentials) => {
    try {
        // Simulando chamada à API
        const response = await simulateApiCall({ 
            success: true, 
            token: 'mock-token-123456',
            user: { email: credentials.email, name: 'Usuário EcoAdventure' }
        });
        return response.data;
    } catch (error) {
        throw { message: 'Erro de autenticação' };
    }
};

export const fetchCourses = async () => {
    try {
        // Simulando chamada à API com os dados mockados
        console.log('Buscando cursos mockados...');
        const response = await simulateApiCall(MOCK_COURSES);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar cursos:', error);
        throw { message: 'Erro ao buscar cursos' };
    }
};

export const fetchCourseDetails = async (courseId) => {
    try {
        // Simulando chamada à API com os dados mockados
        const course = MOCK_COURSES.find(c => c.id === courseId || c.id === courseId.toString());
        
        if (!course) {
            throw new Error('Curso não encontrado');
        }
        
        const response = await simulateApiCall(course);
        return response.data;
    } catch (error) {
        throw { message: 'Erro ao buscar detalhes do curso' };
    }
};

// Create a default export with axios methods
const api = {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete
};

export default api;