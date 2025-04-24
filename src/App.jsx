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
            <div className="pt-28"> {/* aumentei ainda mais o padding-top para acomodar o header com logo maior */}
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