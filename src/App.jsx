import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Routes from './routes';
import { AuthProvider } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import './styles/globals.css';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CourseProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            
            {/* Fita de Desenvolvimento - Diagonal */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 overflow-hidden">
                <div className="absolute top-20 -right-72 bg-red-600 text-white py-3 px-72 text-sm font-bold transform rotate-45 shadow-lg">
                    <span className="whitespace-nowrap">🚧 SITE EM DESENVOLVIMENTO</span>
                </div>
            </div>
            
            <div className="pt-28">
              <main className="flex-grow">
                <Routes />
              </main>
            </div>
            <Footer />
          </div>
        </CourseProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;