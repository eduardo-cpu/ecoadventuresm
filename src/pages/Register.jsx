import React, { useState } from 'react';
import AuthForm from '../components/Auth/AuthForm';
import authService from '../services/authService';

const Register = () => {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleRegister = async (userData) => {
        try {
            await authService.register(userData);
            setSuccess(true);
            setError(null);
        } catch (err) {
            setError(err.message);
            setSuccess(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">Registration successful!</p>}
            <AuthForm onSubmit={handleRegister} />
        </div>
    );
};

export default Register;