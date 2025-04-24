import api from './api';

const COURSE_API_URL = '/api/courses';

export const getCourses = async () => {
    try {
        const response = await api.get(COURSE_API_URL);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching courses: ' + error.message);
    }
};

// Add fetchCourses as an alias for getCourses to fix CourseContext.jsx imports
export const fetchCourses = getCourses;

export const getCourseById = async (courseId) => {
    try {
        const response = await api.get(`${COURSE_API_URL}/${courseId}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching course: ' + error.message);
    }
};

export const createCourse = async (courseData) => {
    try {
        const response = await api.post(COURSE_API_URL, courseData);
        return response.data;
    } catch (error) {
        throw new Error('Error creating course: ' + error.message);
    }
};

// Add addCourse as an alias for createCourse to fix CourseContext.jsx imports
export const addCourse = createCourse;

export const updateCourse = async (courseId, courseData) => {
    try {
        const response = await api.put(`${COURSE_API_URL}/${courseId}`, courseData);
        return response.data;
    } catch (error) {
        throw new Error('Error updating course: ' + error.message);
    }
};

export const deleteCourse = async (courseId) => {
    try {
        await api.delete(`${COURSE_API_URL}/${courseId}`);
    } catch (error) {
        throw new Error('Error deleting course: ' + error.message);
    }
};