import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/Auth/AuthForm';
import { login } from '../services/authService';

const Login = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (credentials) => {
        try {
            await login(credentials);
            navigate('/dashboard');
        } catch (err) {
            setError('Credenciais inválidas. Por favor verifique seu email e senha.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Área Restrita</h2>
                    <p className="text-gray-600 mt-2">Digite suas credenciais para acessar</p>
                </div>
                
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                        <p>{error}</p>
                    </div>
                )}
                
                <AuthForm isLogin={true} onSubmit={handleLogin} />
                
                <div className="mt-6 text-sm text-center text-gray-600">
                    <p>Acesso exclusivo para administradores autorizados.</p>
                    <p className="mt-1">Entre em contato com o suporte técnico em caso de dúvidas.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;