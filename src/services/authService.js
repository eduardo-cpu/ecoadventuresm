import axios from 'axios';

// Definindo o superusuário
const SUPER_USER = {
  email: 'ecoadventuresm@ecoadventure.com',
  password: 'ecoadventure2025',
  name: 'Administrador EcoAdventure',
  role: 'admin'
};

// Função para simular autenticação local
const authenticateLocally = (email, password) => {
  if (email === SUPER_USER.email && password === SUPER_USER.password) {
    // Retorna o usuário sem a senha
    const { password, ...userWithoutPassword } = SUPER_USER;
    return { ...userWithoutPassword, token: 'simulated-jwt-token' };
  }
  // Se as credenciais não corresponderem, lança erro
  throw new Error('Credenciais inválidas. Por favor verifique seu email e senha.');
};

// Esta função está desativada - não permitirá novos registros
export const register = async () => {
  throw new Error('O registro de novos usuários está desativado.');
};

export const login = async ({ email, password }) => {
  try {
    // Autenticação local em vez de chamada à API
    const userData = authenticateLocally(email, password);
    
    // Armazenar no localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export const onAuthStateChanged = (callback) => {
  // Para ambientes de navegador, verifique localStorage ao carregar
  const user = JSON.parse(localStorage.getItem('user'));
  callback(user);
  
  return () => {
    // Função "unsubscribe"
    // Não faz nada nesta implementação simples
  };
};

// Mantém a exportação padrão para compatibilidade com versões anteriores
const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  onAuthStateChanged
};

export default authService;