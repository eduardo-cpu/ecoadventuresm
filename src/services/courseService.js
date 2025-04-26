import api from './api';
import { fetchCourses as apiMockFetchCourses, fetchCourseDetails } from './api';

// Usando a mock API em vez da URL real que não existe
// const COURSE_API_URL = '/api/courses';

// Mock local para armazenar cursos durante a sessão
let mockCoursesData = [];

export const getCourses = async () => {
    try {
        // Usar a função mockada em vez de fazer uma requisição HTTP real
        const courses = await apiMockFetchCourses();
        mockCoursesData = courses; // Salva localmente para outras operações
        return courses;
    } catch (error) {
        throw new Error('Error fetching courses: ' + error.message);
    }
};

// Add fetchCourses as an alias for getCourses to fix CourseContext.jsx imports
export const fetchCourses = getCourses;

export const getCourseById = async (courseId) => {
    try {
        // Usar a função mockada para detalhes do curso
        return await fetchCourseDetails(courseId);
    } catch (error) {
        throw new Error('Error fetching course: ' + error.message);
    }
};

export const createCourse = async (courseData) => {
    try {
        // Simular criação de curso com dados mockados
        const newId = Date.now();
        const newCourse = { id: newId, ...courseData };
        
        // Atualizar dados mockados localmente
        mockCoursesData.push(newCourse);
        
        return newCourse;
    } catch (error) {
        throw new Error('Error creating course: ' + error.message);
    }
};

// Add addCourse as an alias for createCourse to fix CourseContext.jsx imports
export const addCourse = createCourse;

export const updateCourse = async (courseId, courseData) => {
    try {
        // Simular atualização de curso com dados mockados
        const courseIndex = mockCoursesData.findIndex(c => c.id === parseInt(courseId));
        
        if (courseIndex === -1) {
            throw new Error('Course not found');
        }
        
        const updatedCourse = { ...mockCoursesData[courseIndex], ...courseData };
        mockCoursesData[courseIndex] = updatedCourse;
        
        return updatedCourse;
    } catch (error) {
        throw new Error('Error updating course: ' + error.message);
    }
};

export const deleteCourse = async (courseId) => {
    try {
        // Simular exclusão de curso com dados mockados
        const courseIndex = mockCoursesData.findIndex(c => c.id === parseInt(courseId));
        
        if (courseIndex === -1) {
            throw new Error('Course not found');
        }
        
        mockCoursesData.splice(courseIndex, 1);
        return true;
    } catch (error) {
        throw new Error('Error deleting course: ' + error.message);
    }
};