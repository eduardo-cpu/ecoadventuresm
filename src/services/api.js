import axios from 'axios';

// Mock data para cursos (já que não temos uma API real)
const MOCK_COURSES = [
    {
        id: 1,
        title: 'APH - Atendimento pré hospitalar',
        description: 'Curso completo de atendimento pré-hospitalar com certificação reconhecida.',
        duration: '40 horas',
        price: 'R$ 350,00',
        image: '/image.png',
        details: 'O curso de APH (Atendimento Pré-Hospitalar) fornece conhecimentos e habilidades essenciais para o primeiro atendimento em situações de emergência, preparando o aluno para agir corretamente antes da chegada do socorro especializado.'
    },
    {
        id: 2,
        title: 'SBV - Suporte Básico de Vida',
        description: 'Aprenda técnicas fundamentais de suporte básico de vida.',
        duration: '20 horas',
        price: 'R$ 250,00',
        image: '/image.png',
        details: 'O curso de SBV (Suporte Básico de Vida) ensina procedimentos essenciais para manutenção da vida, incluindo RCP, controle de hemorragias e desobstrução de vias aéreas.'
    },
    {
        id: 3,
        title: 'APH-P - Atendimento Pré Hospitalar Pediátrico',
        description: 'Especialização em atendimento pré-hospitalar para crianças.',
        duration: '30 horas',
        price: 'R$ 300,00',
        image: '/image.png',
        details: 'O curso APH-P é focado nas particularidades do atendimento emergencial em crianças, abordando as diferenças anatômicas e fisiológicas e os procedimentos específicos para este público.'
    },
    {
        id: 4,
        title: 'RCU - Resgate em Conflitos Urbanos',
        description: 'Treinamento avançado para resgate em ambientes urbanos complexos.',
        duration: '45 horas',
        price: 'R$ 400,00',
        image: '/image.png',
        details: 'O curso RCU prepara o aluno para situações de emergência em ambientes urbanos hostis, com técnicas de resgate em estruturas colapsadas, áreas de risco e cenários de conflito.'
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
        const course = MOCK_COURSES.find(c => c.id === parseInt(courseId));
        
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