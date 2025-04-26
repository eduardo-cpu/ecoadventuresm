import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RegistrationForm from './components/Registration/RegistrationForm';
import RegistroSucesso from './pages/RegistroSucesso';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inscricao" element={<RegistrationForm />} />
            <Route path="/registro-sucesso" element={<RegistroSucesso />} />
        </Routes>
    );
};

export default AppRoutes;