import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CourseContext } from '../context/CourseContext';
import CourseList from '../components/Courses/CourseList';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const { courses } = useContext(CourseContext);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow p-4">
                <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h1>
                <h2 className="text-xl mb-2">Your Courses:</h2>
                <CourseList courses={courses} />
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;